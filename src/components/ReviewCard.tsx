import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Star, Heart } from "lucide-react";
import { StarRating } from "./StarRating";
import { FoodReview } from "@/types/food-review";
import { useAwards } from "@/hooks/useAwards";
import { openInMaps } from "@/utils/maps";

interface ReviewCardProps {
  review: FoodReview;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const { awards: awardTypes } = useAwards();
  const [likes, setLikes] = useState(0);

  // Get award titles for this review
  const reviewAwards = review.awards?.map(awardId => {
    const awardType = awardTypes.find(award => award.id === awardId);
    return awardType?.title;
  }).filter(Boolean) || [];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        {/* Award Winner Badges */}
        {reviewAwards.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
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
            <Star 
              className="h-4 w-4 text-[#E68C00] fill-[#E68C00]" 
            />
          )}
          {review.awards && review.awards.length > 0 && (
            <span className="text-lg">🏆</span>
          )}
          <CardTitle className="text-xl">{review.name}</CardTitle>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors group"
            onClick={() => openInMaps(review.address, review.latitude, review.longitude)}
          >
            <MapPin className="h-4 w-4 group-hover:text-blue-600" />
            <span className="group-hover:underline">{review.address}</span>
          </div>
          {review.cuisine && (
            <span className="ml-2 px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-semibold">
              {review.cuisine}
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
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
          <p className="font-medium text-sm text-muted-foreground mb-1">Food Eaten</p>
          <p className="text-sm">{review.food_eaten}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
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
            <p className="font-medium text-sm text-muted-foreground mb-1">Description</p>
            <p className="text-sm">{review.description}</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setLikes(prev => prev + 1)}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs border bg-white text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Heart className="h-3 w-3 text-gray-400" />
            {likes}
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