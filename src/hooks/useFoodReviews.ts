import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseClient } from "@/integrations/supabase/client";
import { FoodReview, SortOption } from "@/types/food-review";
import { useToast } from "@/hooks/use-toast";

const mockReviews: FoodReview[] = [
  {
    id: '1',
    name: 'The Mock Pizzeria',
    food_eaten: 'Pepperoni Pizza',
    description: 'A classic pizza place, great for a quick bite. The crust was perfect.',
    rating: 4.5,
    price_paid: 25,
    cuisine: 'Pizza',
    address: '123 Mockingbird Lane, Fakeville, FS 12345',
    created_at: new Date().toISOString(),
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop',
    grants_picks: true,
    food_rating: 5,
    speed_rating: 4,
    service_rating: 4,
    awards: ['best-pizza'], // Add this
  },
  {
    id: '2',
    name: 'The Dummy Diner',
    food_eaten: 'Cheeseburger and Fries',
    description: 'An all-american diner experience. The burger was juicy and the fries were crispy.',
    rating: 4,
    price_paid: 18,
    cuisine: 'American',
    address: '456 Test Street, Devtown, DV 67890',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop',
    grants_picks: false,
    food_rating: 4,
    speed_rating: 4,
    service_rating: 4,
    awards: ['best-burger'], // Add this
  },
  {
    id: '3',
    name: 'Localhost Sushi',
    food_eaten: 'Sushi Platter',
    description: 'Fresh and delicious sushi. The dragon roll is a must-try!',
    rating: 5,
    price_paid: 45,
    cuisine: 'Sushi',
    address: '789 Placeholder Ave, Codetown, CT 54321',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1948&auto=format&fit=crop',
    grants_picks: true,
    food_rating: 5,
    speed_rating: 5,
    service_rating: 5,
    awards: ['best-sushi', 'highest-rated'], // Add this
  },
  {
    id: '4',
    name: 'Silver Spring House',
    food_eaten: 'Chicken Parmesan',
    description: 'Yummy Chicken',
    rating: 5,
    price_paid: 20,
    cuisine: 'American',
    address: '8322 E Kemper Rd, Cincinnati, OH 45249',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1948&auto=format&fit=crop',
    grants_picks: false,
    food_rating: 5,
    speed_rating: 5,
    service_rating: 5,
    awards: ['best-value'], // Add this
  }
];

export const useFoodReviews = (sortBy: SortOption = 'created_at') => {
  const [reviews, setReviews] = useState<FoodReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('food_reviews')
          .select('*')
          .order(sortBy, { ascending: sortBy === 'name' });

        if (error) throw error;

        // PostgreSQL arrays come as actual arrays, no parsing needed
        const processedReviews = data?.map(review => ({
          ...review,
          awards: review.awards || [] // PostgreSQL array is already an array
        })) || [];

        setReviews(processedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [sortBy]);

  return { reviews, loading };
};