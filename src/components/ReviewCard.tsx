import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";
import { FoodReview } from "@/types/food-review";
import { MapPin, DollarSign } from "lucide-react";

interface ReviewCardProps {
  review: FoodReview;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">{review.name}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{review.address}</span>
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

        <div className="text-xs text-muted-foreground">
          Added {new Date(review.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};