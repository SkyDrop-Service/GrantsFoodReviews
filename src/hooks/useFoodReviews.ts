import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FoodReview, SortOption } from "@/types/food-review";
import { useToast } from "@/hooks/use-toast";

export const useFoodReviews = (sortBy: SortOption = 'created_at') => {
  const [reviews, setReviews] = useState<FoodReview[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('food_reviews')
        .select('*');

      // Apply sorting
      switch (sortBy) {
        case 'name':
          query = query.order('name', { ascending: true });
          break;
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
  };

  useEffect(() => {
    fetchReviews();
  }, [sortBy]);

  return { reviews, loading, refetch: fetchReviews };
};