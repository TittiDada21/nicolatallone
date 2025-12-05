export type RepertoireItem = {
    composer: {
        firstName: string
        lastName: string
        birthYear?: number
        deathYear?: number
    }
    pieceTitle: string
    compositionYear?: number
}

export type RepertoireEntry = RepertoireItem & {
    id?: string
    sortOrder?: number
    createdAt?: string
    updatedAt?: string
}

export type RepertoireField =
    | 'composer.firstName'
    | 'composer.lastName'
    | 'composer.birthYear'
    | 'composer.deathYear'
    | 'pieceTitle'
    | 'compositionYear'
