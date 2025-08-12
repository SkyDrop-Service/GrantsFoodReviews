export interface FoodReview {
  id: string;
  name: string;
  food_eaten: string;
  food_rating: number;
  speed_rating: number;
  service_rating: number;
  description?: string;
  price_paid: number;
  address: string;
  photo_url?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export type SortOption = 
  | 'name'
  | 'food_rating'
  | 'speed_rating' 
  | 'service_rating'
  | 'price_paid'
  | 'created_at';