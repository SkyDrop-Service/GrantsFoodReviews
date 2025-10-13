import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Header } from "@/components/Header";
import { useFoodReviews } from "@/hooks/useFoodReviews";
import { useAwards } from "@/hooks/useAwards";
import { FoodReview } from "@/types/food-review";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Star, Heart } from "lucide-react";
import { StarRating } from "@/components/StarRating";
import { openInMaps } from "@/utils/maps";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
import L from "leaflet";

// Create different pin icons based on review type
const createPinIcon = (color: string) => {
  return L.divIcon({
    html: `
      <div style="position: relative;">
        <div style="
          width: 0; 
          height: 0; 
          border-left: 12px solid transparent; 
          border-right: 12px solid transparent; 
          border-top: 20px solid ${color}; 
          position: relative;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        "></div>
        <div style="
          width: 16px; 
          height: 16px; 
          background-color: ${color}; 
          border-radius: 50%; 
          position: absolute; 
          top: -18px; 
          left: -8px;
          border: 2px solid white;
        "></div>
      </div>
    `,
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -32],
  });
};

// Define pin colors
const awardPinIcon = createPinIcon('#EAB308'); // Yellow for awards
const grantsPicksPinIcon = createPinIcon('#E68C00'); // Orange for Grant's picks
const defaultPinIcon = createPinIcon('#3B82F6'); // Blue for regular reviews

const MapView = () => {
  const { reviews, loading } = useFoodReviews();
  const { awards: awardTypes } = useAwards();
  const [selectedReview, setSelectedReview] = useState<FoodReview | null>(null);

  // Filter reviews that have coordinates
  const reviewsWithCoords = reviews.filter(
    (review) => review.latitude && review.longitude
  );

  // Default center (Cincinnati area)
  const defaultCenter: [number, number] = [39.1031, -84.5120];

  // Function to get the appropriate icon for a review
  const getReviewIcon = (review: FoodReview) => {
    // Awards have highest priority
    if (review.awards && review.awards.length > 0) {
      return awardPinIcon;
    }
    // Grant's picks have second priority
    if (review.grants_picks) {
      return grantsPicksPinIcon;
    }
    // Default for regular reviews
    return defaultPinIcon;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEDED' }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </>
    );
  }

  const ReviewCard = ({ review }: { review: FoodReview }) => {
    // Get award titles for this review
    const reviewAwards = review.awards?.map(awardId => {
      const awardType = awardTypes.find(award => award.id === awardId);
      return awardType?.title;
    }).filter(Boolean) || [];

    return (
      <Card className="w-full h-full overflow-y-auto">
        <CardHeader className="pb-4">
          {/* Award Winner Badges */}
          {reviewAwards.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {reviewAwards.map((awardTitle, index) => (
                <Badge 
                  key={index}
                  className="text-xs font-bold px-2 py-1 text-white"
                  style={{ backgroundColor: '#EAB308' }}
                >
                  🏆 {awardTitle} Winner
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            {review.grants_picks && (
              <Star className="h-4 w-4 text-[#E68C00] fill-[#E68C00]" />
            )}
            {review.awards && review.awards.length > 0 && (
              <span className="text-lg">🏆</span>
            )}
            <CardTitle className="text-lg">{review.name}</CardTitle>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors group"
              onClick={(e) => {
                e.stopPropagation();
                openInMaps(review.address, review.latitude, review.longitude);
              }}
            >
              <MapPin className="h-4 w-4 group-hover:text-blue-600" />
              <span className="group-hover:underline text-xs">{review.address}</span>
            </div>
            {review.cuisine && (
              <span className="ml-2 px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-semibold">
                {review.cuisine}
              </span>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4 space-y-3">
          {review.photo_url && (
            <div className="aspect-video w-full overflow-hidden rounded-md">
              <img
                src={review.photo_url}
                alt={review.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div>
            <p className="font-medium text-xs text-muted-foreground mb-1">Food Eaten</p>
            <p className="text-sm">{review.food_eaten}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="font-medium text-xs text-muted-foreground mb-1">Food</p>
              <StarRating rating={review.food_rating} />
            </div>
            <div>
              <p className="font-medium text-xs text-muted-foreground mb-1">Speed</p>
              <StarRating rating={review.speed_rating} />
            </div>
            <div>
              <p className="font-medium text-xs text-muted-foreground mb-1">Service</p>
              <StarRating rating={review.service_rating} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <Badge variant="secondary">${review.price_paid}</Badge>
          </div>

          {review.description && (
            <div>
              <p className="font-medium text-xs text-muted-foreground mb-1">Description</p>
              <p className="text-xs leading-relaxed">{review.description}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-2 py-1 rounded text-xs border bg-white text-gray-600 border-gray-300">
              <Heart className="h-3 w-3 text-gray-400" />
              0
            </button>
            <span className="text-xs text-muted-foreground">Like this review</span>
          </div>

          <div className="text-xs text-muted-foreground">
            Added {new Date(review.created_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen" style={{ backgroundColor: '#EDEDED' }}>
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Restaurant Map</h1>
            <p className="text-muted-foreground">
              Click on markers to see detailed reviews
            </p>
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#EAB308] rounded-full"></div>
                <span>Award Winner</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#E68C00] rounded-full"></div>
                <span>Grant's Picks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#3B82F6] rounded-full"></div>
                <span>Regular Review</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="h-full rounded-lg overflow-hidden border">
                <MapContainer
                  center={defaultCenter}
                  zoom={11}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {reviewsWithCoords.map((review) => (
                    <Marker
                      key={review.id}
                      position={[review.latitude!, review.longitude!]}
                      icon={getReviewIcon(review)}
                      eventHandlers={{
                        click: () => setSelectedReview(review),
                      }}
                    >
                      <Popup>
                        <div className="text-center">
                          <strong>{review.name}</strong>
                          <br />
                          {review.food_eaten}
                          <br />
                          Rating: {review.rating}/5
                          {review.awards && review.awards.length > 0 && (
                            <>
                              <br />
                              🏆 Award Winner
                            </>
                          )}
                          {review.grants_picks && (
                            <>
                              <br />
                              ⭐ Grant's Pick
                            </>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* Review Details */}
            <div className="lg:col-span-1">
              <div className="h-full">
                {selectedReview ? (
                  <div className="h-full w-full" style={{ aspectRatio: '1' }}>
                    <ReviewCard review={selectedReview} />
                  </div>
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Click on a marker to view the full review
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {reviewsWithCoords.length === 0 && (
            <div className="text-center mt-8">
              <p className="text-gray-500">
                No reviews with location data available.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MapView;
