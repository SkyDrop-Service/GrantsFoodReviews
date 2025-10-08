
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { RecenterMap } from '@/components/RecenterMap';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FoodReview } from '@/types/food-review';
import { ReviewCard } from '@/components/ReviewCard';
import { Header } from '@/components/Header';
import { Star } from 'lucide-react';

// custom icons
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;


const CINCINNATI: LatLngExpression = [39.1031, -84.5120];



export default function MapView() {
    const [reviews, setReviews] = useState<FoodReview[]>([]);
    const [mapCenter, setMapCenter] = useState<LatLngExpression>(CINCINNATI);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setMapCenter([pos.coords.latitude, pos.coords.longitude]);
                },
                () => {
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
                        <Marker
                            key={review.id}
                            position={[review.latitude || 0, review.longitude || 0]}
                            icon={review.grants_picks ? orangeIcon : blueIcon}
                        >
                            <Popup>
                                <div className="p-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        {review.grants_picks && (
                                            <Star className="h-4 w-4 text-[#E68C00] fill-[#E68C00]" />
                                        )}
                                        <h3 className="font-semibold">{review.name}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{review.address}</p>
                                    <p className="text-sm mb-1">Food: {review.food_eaten}</p>
                                    <p className="text-sm mb-1">Rating: {review.rating}/5</p>
                                    {review.price_paid && (
                                        <p className="text-sm">Price: ${review.price_paid}</p>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
