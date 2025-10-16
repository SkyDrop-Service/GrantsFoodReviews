import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useLikes = (reviewId: string) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const getUserUUID = async () => {
    try {
      let userUUID = localStorage.getItem('user_uuid');
      
      if (!userUUID) {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ip = data.ip;
        
        const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        userUUID = [
          hashHex.substring(0, 8),
          hashHex.substring(8, 12),
          hashHex.substring(12, 16),
          hashHex.substring(16, 20),
          hashHex.substring(20, 32)
        ].join('-');
        
        localStorage.setItem('user_uuid', userUUID);
      }
      
      return userUUID;
    } catch (error) {
      console.error('Error getting user UUID:', error);
      let fallbackUUID = localStorage.getItem('user_uuid');
      if (!fallbackUUID) {
        fallbackUUID = crypto.randomUUID();
        localStorage.setItem('user_uuid', fallbackUUID);
      }
      return fallbackUUID;
    }
  };

  const fetchLikes = async () => {
    try {
      const { count } = await supabase
        .from('review_likes')
        .select('*', { count: 'exact', head: true })
        .eq('review_id', reviewId);

      setLikes(count || 0);

      const userUUID = await getUserUUID();
      const { data } = await supabase
        .from('review_likes')
        .select('id')
        .eq('review_id', reviewId)
        .eq('user_id', userUUID)
        .maybeSingle();

      setIsLiked(!!data);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const toggleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const userUUID = await getUserUUID();

      if (isLiked) {
        const { error } = await supabase
          .from('review_likes')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', userUUID);

        if (error) throw error;

        setLikes(prev => prev - 1);
        setIsLiked(false);
      } else {
        const { error } = await supabase
          .from('review_likes')
          .insert({
            review_id: reviewId,
            user_id: userUUID
          });

        if (error) throw error;

        setLikes(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reviewId) {
      fetchLikes();
    }
  }, [reviewId]);

  return {
    likes,
    isLiked,
    loading,
    toggleLike
  };
};