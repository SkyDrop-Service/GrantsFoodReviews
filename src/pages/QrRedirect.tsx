import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QrRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Track the scan event (simple fetch to Supabase or analytics)
        fetch('/api/track-qr-scan', { method: 'POST' });
        // Redirect to main page
        navigate('/', { replace: true });
    }, [navigate]);

    return null;
};

export default QrRedirect;
