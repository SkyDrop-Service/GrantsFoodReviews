import { useState, useEffect } from 'react';
import { supabase, isSupabaseClient } from '@/integrations/supabase/client';

export const useQrScans = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQrScanCount = async () => {
      if (!isSupabaseClient(supabase)) {
        // Mock data for development
        setCount(42);
        setLoading(false);
        return;
      }

      try {
        const { count: scanCount, error } = await supabase
          .from('qr_scans')
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error('Error fetching QR scan count:', error);
          setCount(0);
        } else {
          setCount(scanCount || 0);
        }
      } catch (error) {
        console.error('Error:', error);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchQrScanCount();
  }, []);

  return { count, loading };
};