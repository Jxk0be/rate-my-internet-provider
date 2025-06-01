export interface Location {
  id: number
  location: string
  locationFormatted?: string
  num_of_providers: number
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
  created_at: string
  user_id: string | null
  user_display: string | null
  loc_name: string | null
  provider_id: number
  provider_name: string | null
  comment: string
  speed: number | null
  price: number | null
  value: number | null
  setup: number | null
  support: number | null
  transparency: number | null
  reliability: number | null
}
