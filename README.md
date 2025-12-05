# nicolatallone.com — React SPA

Sito single-page per Nicola Raffaello Tallone. React + Vite + React Router, grafica full-screen con glassmorphism. Supabase gestisce eventi, galleria e login admin collegati tramite MCP in Cursor.

## Avvio rapido

```bash
npm install
npm run dev
```

1. Duplica `.env.example` in `.env.local` e inserisci `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`.
2. Aggiungi sfondo hero in `public/media/hero-image.png` (foto alta risoluzione) e logo/favico nella cartella `public/media/logo-formats/`.
3. Sostituisci i link social nei componenti `Footer` e i contenuti statici in `src/data/pageConfig.ts`.

## Struttura cartelle

```
src/
  components/
    common/         # Pannelli glass, redirect esterni
    events/         # Card evento + modale admin
    layout/         # Header + Footer
  data/             # Navigazione e contenuti statici
  layouts/          # AppLayout con hero full screen
  pages/            # Home, pagine contenuto, galleria
  providers/        # AuthProvider e EventProvider (Supabase)
  lib/              # Supabase client
  types/            # Tipi condivisi (Eventi, Gallery)
```

## Supabase + MCP

1. **Collegamento MCP**
   - In Cursor apri `cursor://mcp/supabase` e usa le tue chiavi Project URL + anon key.
   - Salva nel profilo MCP per riutilizzarle.

2. **Tabelle consigliate**
   ```sql
   create table public.events (
     id uuid primary key default gen_random_uuid(),
     title text not null,
     description text,
     starts_at timestamptz not null,
     address text,
     is_free boolean not null default true,
     price numeric,
     external_url text,
     location_url text,
     created_at timestamptz default now(),
     updated_at timestamptz default now()
   );

   create table public.gallery_items (
     id uuid primary key default gen_random_uuid(),
     title text not null,
     type text check (type in ('image','video')) not null,
     url text not null,
     thumbnail_url text,
     created_at timestamptz default now()
   );
   ```

3. **RLS**
   - `events`: policy read pubblica (`select` per `anon`), insert/update/delete solo per ruolo `authenticated`.
   - `gallery_items`: stessa logica.

4. **Storage**
   - Bucket `gallery` in Supabase Storage. Ogni file -> URL firmato o pubblico. Salva i link nella tabella `gallery_items`.

5. **Auth**
   - Crea utente admin (email/password) da Supabase Auth.
   - In MCP usa i comandi `supabase auth admin` per gestione utenti se serve.
   - Le credenziali vengono usate dalla modale admin (`supabase.auth.signInWithPassword`).

## Modale admin eventi

- Pulsante `+` sotto la card apre modale.
- Se non loggato → form login.
- Se loggato → form evento (data/ora, descrizione, offerta libera, link esterni, Google Maps).
- Bottoni `Salva`, `Elimina` (solo in modifica), `Esci`.
- Le mutazioni passano da `EventProvider` verso Supabase.

## Contenuti statici

- `src/data/pageConfig.ts` definisce titoli e paragrafi delle pagine (`/cv/...`, `/progetti/...`, ecc.).
- `src/data/navigation.ts` controlla il menu e i dropdown, incluso il link esterno a Silarte.
- Aggiorna testo/URL e aggiungi paragrafi senza toccare i componenti.

## Asset

- `public/media/hero-image.png` → immagine full screen (1920x1080 o superiore).
- `public/media/logo-formats/` → logo principale (`icon.svg`/`icon.png`) e pacchetto favicons in `icon-favicons/`.
- Galleria: carica foto/video su Supabase Storage e registra il link in `gallery_items`.

## Styling

- Layout senza scroll (`body` overflow hidden). Navigazione e contenuti si mostrano come pannelli glass.
- Componenti chiave: `HeroEventCard`, `GlassPanel`.
- Font di default: Helvetica/Arial. Aggiungi Google Fonts modificando `index.html` se serve.

## Workflow Git

**IMPORTANTE**: Dopo ogni modifica, fare sempre commit e push:
```bash
git add -A
git commit -m "Descrizione modifiche"
git push
```

## Script utili

| Comando        | Descrizione                    |
| -------------- | ------------------------------ |
| `npm run dev`  | Dev server Vite                |
| `npm run build`| Build produzione               |
| `npm run lint` | Lint ESLint + TypeScript       |

## Prossimi step

- Collegare Supabase con MCP e testare login/modifica eventi.
- Popolare `pageConfig.ts` con i testi definitivi.
- Sostituire fallback social/whatsapp/email reali in `Footer`.
- Implementare upload automatizzato galleria (es. comando MCP che chiama Storage).
