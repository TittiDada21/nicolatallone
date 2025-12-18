export type EventRecord = {
  id: string
  title: string
  description?: string | null
  startsAt: string
  address?: string | null
  isFree: boolean
  price?: number | null
  externalUrl?: string | null
  locationUrl?: string | null
  imageUrl?: string | null
  createdAt?: string
  updatedAt?: string
}

export type EventFormValues = {
  title: string
  description?: string
  startsAt: string
  address?: string
  isFree: boolean
  price?: number
  externalUrl?: string
  locationUrl?: string
  imageUrl?: string
}

