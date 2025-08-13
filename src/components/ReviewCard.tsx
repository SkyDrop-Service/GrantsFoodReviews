import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";
import { FoodReview } from "@/types/food-review";
import { MapPin, DollarSign, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ReviewCardProps {
  review: FoodReview;
}


export const ReviewCard = ({ review }: ReviewCardProps) => {
  const { user } = useAuth();
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      // Get like count
      const { data: countData, error: countError } = await (supabase
        .from("review_likes" as any)
        .select("count")
        .eq("review_id", review.id));
      setLikeCount(countData ? countData.length : 0);

      // Check if user liked
      if (user) {
        const { data: userLike, error: userLikeError } = await (supabase
          .from("review_likes" as any)
          .select("id")
          .eq("review_id", review.id)
          .eq("user_id", user.id)
          .single());
        setLiked(!!userLike);
      } else {
        setLiked(false);
      }
    };
    fetchLikes();
  }, [review.id, user]);

  const handleLike = async () => {
    if (!user || liked) return;
    setLoading(true);
    const { error } = await (supabase
      .from("review_likes" as any)
      .insert({ review_id: review.id, user_id: user.id }));
    if (!error) {
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
    setLoading(false);
  };

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

        <div className="flex items-center gap-2 mt-2">
          <button
            className={`flex items-center gap-1 px-2 py-1 rounded text-sm border ${liked ? "bg-red-100 text-red-600" : "bg-white text-gray-600"}`}
            onClick={handleLike}
            disabled={liked || loading || !user}
            aria-label={liked ? "Liked" : "Like"}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-red-600" : ""}`} />
            {likeCount}
          </button>
          <span className="text-xs text-muted-foreground">{liked ? "You liked this" : "Like this review"}</span>
        </div>

        <div className="text-xs text-muted-foreground">
          Added {new Date(review.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};