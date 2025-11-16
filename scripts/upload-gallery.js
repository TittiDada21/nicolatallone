#!/usr/bin/env node

/**
 * Script per caricare bulk foto nella galleria Supabase
 * 
 * Uso:
 * 1. Metti le foto in una cartella (es. public/gallery-upload/)
 * 2. Esegui: node scripts/upload-gallery.js <path-cartella>
 * 
 * Esempio:
 * node scripts/upload-gallery.js public/gallery-upload
 */

import { createClient } from '@supabase/supabase-js'
import { readdir, readFile } from 'fs/promises'
import { readFileSync } from 'fs'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Leggi variabili da .env.local o .env
function loadEnv() {
  const envFiles = ['.env.local', '.env']
  for (const file of envFiles) {
    try {
      const content = readFileSync(file, 'utf-8')
      const lines = content.split('\n')
      for (const line of lines) {
        const match = line.match(/^([^=]+)=(.*)$/)
        if (match) {
          const key = match[1].trim()
          const value = match[2].trim().replace(/^["']|["']$/g, '')
          if (!process.env[key]) {
            process.env[key] = value
          }
        }
      }
    } catch (err) {
      // File non trovato, continua
    }
  }
}

loadEnv()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ADMIN_EMAIL = process.env.SUPABASE_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.SUPABASE_ADMIN_PASSWORD

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Errore: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY devono essere impostati')
  console.error('   Crea un file .env nella root del progetto con:')
  console.error('   VITE_SUPABASE_URL=your-url')
  console.error('   VITE_SUPABASE_ANON_KEY=your-key')
  console.error('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (opzionale, bypassa RLS)')
  console.error('   oppure:')
  console.error('   SUPABASE_ADMIN_EMAIL=your-admin-email')
  console.error('   SUPABASE_ADMIN_PASSWORD=your-admin-password')
  process.exit(1)
}

// Usa service role key se disponibile (bypassa RLS), altrimenti anon key
const supabase = createClient(
  SUPABASE_URL,
  SERVICE_ROLE_KEY || SUPABASE_ANON_KEY,
  SERVICE_ROLE_KEY
    ? {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    : undefined,
)

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

async function uploadGallery(folderPath) {
  try {
    // Autenticazione admin se disponibile (solo se non usiamo service role key)
    if (!SERVICE_ROLE_KEY && ADMIN_EMAIL && ADMIN_PASSWORD) {
      console.log('🔐 Autenticazione come admin...')
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      })
      if (authError) {
        console.warn('⚠️  Errore autenticazione:', authError.message)
        console.warn('   Continuo senza autenticazione (potrebbero esserci errori RLS)')
      } else {
        console.log('✅ Autenticato come admin\n')
      }
    } else if (!SERVICE_ROLE_KEY) {
      console.warn('⚠️  Nessuna credenziale admin o service role key trovata')
      console.warn('   Aggiungi SUPABASE_SERVICE_ROLE_KEY (consigliato) oppure')
      console.warn('   SUPABASE_ADMIN_EMAIL e SUPABASE_ADMIN_PASSWORD al .env per evitare errori RLS\n')
    } else {
      console.log('✅ Usando service role key (bypassa RLS)\n')
    }

    console.log(`📁 Leggo la cartella: ${folderPath}`)
    
    const files = await readdir(folderPath)
    const imageFiles = files.filter(file => {
      const ext = extname(file).toLowerCase()
      return ALLOWED_EXTENSIONS.includes(ext)
    })

    if (imageFiles.length === 0) {
      console.log('⚠️  Nessuna immagine trovata nella cartella')
      return
    }

    console.log(`📸 Trovate ${imageFiles.length} immagini\n`)

    let successCount = 0
    let errorCount = 0

    for (const file of imageFiles) {
      try {
        const filePath = join(folderPath, file)
        const fileBuffer = await readFile(filePath)
        
        if (fileBuffer.length > MAX_FILE_SIZE) {
          console.log(`⚠️  ${file}: troppo grande (${(fileBuffer.length / 1024 / 1024).toFixed(2)}MB), salto`)
          errorCount++
          continue
        }

        const fileExt = extname(file).toLowerCase()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`
        const storagePath = fileName

        console.log(`⬆️  Carico: ${file}...`)

        // Determina il MIME type corretto
        const mimeTypes = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.webp': 'image/webp',
          '.gif': 'image/gif',
        }
        const contentType = mimeTypes[fileExt.toLowerCase()] || `image/${fileExt.slice(1)}`

        // Upload su Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(storagePath, fileBuffer, {
            cacheControl: '3600',
            upsert: false,
            contentType: contentType,
          })

        if (uploadError) {
          console.error(`❌ Errore upload ${file}:`, uploadError.message)
          errorCount++
          continue
        }

        // Ottieni URL pubblico
        const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(storagePath)
        const publicUrl = urlData.publicUrl

        // Crea entry nella tabella
        let title = basename(file, fileExt)
        // Formatta il titolo: sostituisci underscore e trattini con spazi
        title = title.replace(/[_-]/g, ' ').trim()
        const { error: insertError } = await supabase
          .from('gallery_items')
          .insert({
            title: title,
            type: 'image',
            url: publicUrl,
            thumbnail_url: publicUrl,
          })

        if (insertError) {
          console.error(`❌ Errore inserimento DB ${file}:`, insertError.message)
          // Rimuovi file caricato
          await supabase.storage.from('gallery').remove([storagePath])
          errorCount++
          continue
        }

        console.log(`✅ ${file} caricato con successo`)
        successCount++

        // Piccola pausa per non sovraccaricare
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`❌ Errore con ${file}:`, error.message)
        errorCount++
      }
    }

    console.log(`\n📊 Riepilogo:`)
    console.log(`   ✅ Caricate: ${successCount}`)
    console.log(`   ❌ Errori: ${errorCount}`)
    console.log(`   📸 Totale: ${imageFiles.length}`)
  } catch (error) {
    console.error('❌ Errore generale:', error.message)
    process.exit(1)
  }
}

// Main
const folderPath = process.argv[2]

if (!folderPath) {
  console.error('❌ Errore: specifica il percorso della cartella')
  console.error('   Uso: node scripts/upload-gallery.js <path-cartella>')
  console.error('   Esempio: node scripts/upload-gallery.js public/gallery-upload')
  process.exit(1)
}

uploadGallery(folderPath)

