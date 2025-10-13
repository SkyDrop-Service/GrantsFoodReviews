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
  const { toast } = useToast();

  const fetchReviews = useCallback(async () => {
    if (import.meta.env.MODE !== 'production' || !isSupabaseClient(supabase)) {
      console.log("Development mode: Using mock review data.");
      setLoading(true);
      setTimeout(() => {
        const sortedMocks = [...mockReviews].sort((a, b) => {
          if (sortBy === 'rating') {
            return b.rating - a.rating;
          }
          if (sortBy === 'price_paid') {
              return (b.price_paid || 0) - (a.price_paid || 0);
          }
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setReviews(sortedMocks);
        setLoading(false);
      }, 500);
      return;
    }

    try {
      setLoading(true);
      
      let query = supabase
        .from('food_reviews')
        .select('*');

      switch (sortBy) {
        case 'name':
          query = query.order('name', { ascending: true });
          break;
        case 'rating':
        case 'food_rating':
        case 'speed_rating':
        case 'service_rating':
          query = query.order(sortBy, { ascending: false });
          break;
        case 'price_paid':
          query = query.order('price_paid', { ascending: true });
          break;
        case 'created_at':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching reviews:', error);
        toast({
          title: "Error",
          description: "Failed to load reviews",
          variant: "destructive",
        });
        return;
      }

      setReviews(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [sortBy, toast]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, refetch: fetchReviews };
};