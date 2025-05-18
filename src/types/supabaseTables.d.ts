export interface Location {
  id: number
  location: string
}

export interface Provider {
  id: number
  location_id: number
  name: string
  overall_rating: number | null
  overall_speed: number | null
  overall_price: number | null
  overall_value: number | null
  overall_setup: number | null
  overall_support: number | null
  overall_transparency: number | null
  overall_reliability: number | null
  total_reviews: number | null
}

export interface Review {
  id: number
  user_id: string | null
  provider_id: number
  comment: string
  speed: number | null
  price: number | null
  value: number | null
  setup: number | null
  support: number | null
  transparency: number | null
  reliability: number | null
}
