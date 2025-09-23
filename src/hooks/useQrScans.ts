import { useState, useEffect } from 'react';
import { supabase, isSupabaseClient } from '@/integrations/supabase/client';

interface QrScanAnalytics {
  totalScans: number;
  byOS: Record<string, number>;
  byBrowser: Record<string, number>;
  byDevice: Record<string, number>;
}

export const useQrScans = () => {
  const [count, setCount] = useState<number>(0);
  const [analytics, setAnalytics] = useState<QrScanAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQrScanData = async () => {
      if (!isSupabaseClient(supabase)) {
        // Mock data for development
        setCount(42);
        setAnalytics({
          totalScans: 42,
          byOS: { 'iOS': 18, 'Android': 12, 'macOS': 8, 'Windows': 4 },
          byBrowser: { 'Safari': 20, 'Chrome': 15, 'Firefox': 5, 'Edge': 2 },
          byDevice: { 'Mobile': 30, 'Desktop': 10, 'Tablet': 2 }
        });
        setLoading(false);
        return;
      }

      try {
        // Get total count
        const { count: scanCount, error: countError } = await supabase
          .from('qr_scans')
          .select('*', { count: 'exact', head: true });

        if (countError) throw countError;

        // Get detailed analytics
        const { data: scans, error: dataError } = await supabase
          .from('qr_scans')
          .select('operating_system, browser, device_type');

        if (dataError) throw dataError;

        // Process analytics
        const byOS: Record<string, number> = {};
        const byBrowser: Record<string, number> = {};
        const byDevice: Record<string, number> = {};

        scans?.forEach(scan => {
          if (scan.operating_system) {
            byOS[scan.operating_system] = (byOS[scan.operating_system] || 0) + 1;
          }
          if (scan.browser) {
            byBrowser[scan.browser] = (byBrowser[scan.browser] || 0) + 1;
          }
          if (scan.device_type) {
            byDevice[scan.device_type] = (byDevice[scan.device_type] || 0) + 1;
          }
        });

        setCount(scanCount || 0);
        setAnalytics({
          totalScans: scanCount || 0,
          byOS,
          byBrowser,
          byDevice
        });
      } catch (error) {
        console.error('Error fetching QR scan data:', error);
        setCount(0);
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQrScanData();
  }, []);

  return { count, analytics, loading };
};