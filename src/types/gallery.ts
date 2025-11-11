export type GalleryItem = {
  id: string
  title: string
  type: 'image' | 'video'
  url: string
  thumbnailUrl?: string
  createdAt?: string
}

