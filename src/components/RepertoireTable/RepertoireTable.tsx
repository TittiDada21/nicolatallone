import type { RepertoireItem } from '@/types/repertoire'
import styles from './RepertoireTable.module.css'

type RepertoireTableProps = {
    repertoire: RepertoireItem[]
}

export function RepertoireTable({ repertoire }: RepertoireTableProps) {
    const formatComposer = (composer: RepertoireItem['composer']): string => {
        const { firstName, lastName, birthYear, deathYear } = composer
        const name = `${lastName} ${firstName}`

        if (birthYear && deathYear) {
            return `${name} (${birthYear}-${deathYear})`
        }
        if (birthYear) {
            return `${name} (${birthYear})`
        }
        return name
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Compositore</th>
                        <th>Titolo del brano</th>
                        <th>Data di composizione</th>
                    </tr>
                </thead>
                <tbody>
                    {repertoire.map((item, index) => (
                        <tr key={index}>
                            <td>{formatComposer(item.composer)}</td>
                            <td>{item.pieceTitle}</td>
                            <td>{item.compositionYear || '—'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
