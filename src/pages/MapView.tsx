
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { RecenterMap } from '@/components/RecenterMap';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FoodReview } from '@/types/food-review';
import { ReviewCard } from '@/components/ReviewCard';
import { Header } from '@/components/Header';

// Default icon fix for Leaflet in React
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;


// Cincinnati, OH coordinates
const CINCINNATI: LatLngExpression = [39.1031, -84.5120];



export default function MapView() {
    const [reviews, setReviews] = useState<FoodReview[]>([]);
    const [mapCenter, setMapCenter] = useState<LatLngExpression>(CINCINNATI);

    useEffect(() => {
        // Try to get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setMapCenter([pos.coords.latitude, pos.coords.longitude]);
                },
                () => {
                    setMapCenter(CINCINNATI); // fallback if denied
                }
            );
        }
    }, []);

    useEffect(() => {
        const fetchReviews = async () => {
            const { data, error } = await supabase
                .from('food_reviews')
                .select('*');
            if (!error && data) setReviews(data);
        };
        fetchReviews();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div style={{ flex: 1, height: '100%' }}>
                <MapContainer center={mapCenter} zoom={12} style={{ height: '100vh', width: '100%' }}>
                    <RecenterMap center={mapCenter as [number, number]} />
                    <TileLayer
                        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />
                    {reviews.map((review) => (
                        review.address && review.latitude && review.longitude ? (
                            <Marker key={review.id} position={[review.latitude, review.longitude]}>
                                <Popup minWidth={350} maxWidth={400}>
                                    <ReviewCard review={review} />
                                </Popup>
                            </Marker>
                        ) : null
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
