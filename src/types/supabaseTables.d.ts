export interface Location {
  id: number
  location: string
}

export interface Provider {
  id: number
  location_id: number
  name: string
  overall_rating: number | null
}

export interface Review {
  id: number
  user_id: string | null
  provider_id: number
  rating: number
  comment: string
}
