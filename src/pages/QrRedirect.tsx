/*
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const QrRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Delay the redirect to allow analytics to capture the page view.
        const redirectTimer = setTimeout(() => {
            navigate('/', { replace: true });
        }, 500);

        return () => clearTimeout(redirectTimer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-muted-foreground">Redirecting to the homepage...</p>
        </div>
    );
};

export default QrRedirect;
*/