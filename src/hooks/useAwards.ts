import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Award {
  id: string;
  title: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export const useAwards = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAwards = async () => {
    try {
      const { data, error } = await supabase
        .from('awards')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setAwards(data || []);
    } catch (error) {
      console.error('Error fetching awards:', error);
      setAwards([]);
    } finally {
      setLoading(false);
    }
  };

  const createAward = async (award: Omit<Award, 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('awards')
        .insert([award])
        .select()
        .single();

      if (error) throw error;
      
      setAwards(prev => [...prev, data]);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating award:', error);
      return { success: false, error };
    }
  };

  const deleteAward = async (awardId: string) => {
    try {
      const { error } = await supabase
        .from('awards')
        .delete()
        .eq('id', awardId);

      if (error) throw error;

      // Also remove this award from all reviews
      await supabase.rpc('remove_award_from_reviews', { award_id: awardId });

      setAwards(prev => prev.filter(award => award.id !== awardId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting award:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  return {
    awards,
    loading,
    createAward,
    deleteAward,
    refetch: fetchAwards
  };
};