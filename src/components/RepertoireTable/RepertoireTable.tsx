import type { ChangeEvent } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

import type { RepertoireField, RepertoireItem } from '@/types/repertoire'

import styles from './RepertoireTable.module.css'

type RepertoireTableProps = {
  repertoire: RepertoireItem[]
  editable?: boolean
  loading?: boolean
  saving?: boolean
  error?: string
  onChange?: (index: number, field: RepertoireField, value: string | number | undefined) => void
  onAddRow?: () => void
  onDeleteRow?: (index: number) => void
}

const formatComposer = (composer: RepertoireItem['composer']): string => {
  const { firstName, lastName, birthYear, deathYear } = composer
  const name = `${lastName} ${firstName}`.trim()

  if (birthYear && deathYear) {
    return `${name} (${birthYear}-${deathYear})`
  }
  if (birthYear) {
    return `${name} (${birthYear})`
  }
  return name || '—'
}

const toNumberOrUndefined = (value: string): number | undefined => {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

export function RepertoireTable({
  repertoire,
  editable = false,
  loading = false,
  saving = false,
  error,
  onChange,
  onAddRow,
  onDeleteRow,
}: RepertoireTableProps) {
  const handleChange = (index: number, field: RepertoireField) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (!onChange) return

    if (field === 'composer.birthYear' || field === 'composer.deathYear' || field === 'compositionYear') {
      onChange(index, field, value ? toNumberOrUndefined(value) : undefined)
    } else {
      onChange(index, field, value)
    }
  }

  if (loading) {
    return <p className={styles.placeholder}>Carico il repertorio…</p>
  }

  return (
    <div className={styles.tableWrapper}>
      {error && <p className={styles.error}>{error}</p>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Compositore</th>
            <th>Titolo del brano</th>
            <th>Data di composizione</th>
            {editable && <th className={styles.actionsHeader}>Azioni</th>}
          </tr>
        </thead>
        <tbody>
          {repertoire.length === 0 ? (
            <tr>
              <td colSpan={editable ? 4 : 3} className={styles.placeholderCell}>
                Nessun brano inserito.
              </td>
            </tr>
          ) : (
            repertoire.map((item, index) => (
              <tr key={index}>
                <td data-label="Compositore">
                  {editable ? (
                    <div className={styles.composerInputs}>
                      <div className={styles.nameRow}>
                        <input
                          type="text"
                          value={item.composer.lastName}
                          onChange={handleChange(index, 'composer.lastName')}
                          placeholder="Cognome"
                          className={styles.input}
                        />
                        <input
                          type="text"
                          value={item.composer.firstName}
                          onChange={handleChange(index, 'composer.firstName')}
                          placeholder="Nome"
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.yearsRow}>
                        <input
                          type="number"
                          value={item.composer.birthYear ?? ''}
                          onChange={handleChange(index, 'composer.birthYear')}
                          placeholder="Nascita"
                          className={`${styles.input} ${styles.yearInput}`}
                        />
                        <span className={styles.yearSeparator}>-</span>
                        <input
                          type="number"
                          value={item.composer.deathYear ?? ''}
                          onChange={handleChange(index, 'composer.deathYear')}
                          placeholder="Morte"
                          className={`${styles.input} ${styles.yearInput}`}
                        />
                      </div>
                    </div>
                  ) : (
                    formatComposer(item.composer)
                  )}
                </td>
                <td data-label="Titolo">
                  {editable ? (
                    <input
                      type="text"
                      value={item.pieceTitle}
                      onChange={handleChange(index, 'pieceTitle')}
                      placeholder="Titolo del brano"
                      className={styles.input}
                    />
                  ) : (
                    item.pieceTitle
                  )}
                </td>
                <td data-label="Data">
                  {editable ? (
                    <input
                      type="number"
                      value={item.compositionYear ?? ''}
                      onChange={handleChange(index, 'compositionYear')}
                      placeholder="Anno"
                      className={`${styles.input} ${styles.yearInput}`}
                    />
                  ) : (
                    item.compositionYear ?? '—'
                  )}
                </td>
                {editable && (
                  <td className={styles.actionsCell} data-label="Azioni">
                    <button
                      type="button"
                      onClick={() => onDeleteRow?.(index)}
                      className={styles.iconButton}
                      aria-label="Elimina riga"
                    >
                      <FiTrash2 aria-hidden />
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editable && (
        <div className={styles.tableActions}>
          <button type="button" onClick={onAddRow} className={styles.addRowButton}>
            <FiPlus aria-hidden />
            Aggiungi riga
          </button>
          {saving && <span className={styles.savingText}>Salvataggio…</span>}
        </div>
      )}
    </div>
  )
}
