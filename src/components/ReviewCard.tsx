import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";
import { FoodReview } from "@/types/food-review";
import { MapPin, DollarSign, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ReviewCardProps {
  review: FoodReview;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const [userId, setUserId] = useState<string>("");
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let storedId = localStorage.getItem("foodreview_user_id");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("foodreview_user_id", storedId);
    }
    setUserId(storedId);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchLikes = async () => {
      const { data, count, error } = await supabase
        .from("review_likes")
        .select("id", { count: "exact", head: true })
        .eq("review_id", review.id);
      setLikeCount(count ?? 0);

      const { data: userLike } = await supabase
        .from("review_likes")
        .select("id")
        .eq("review_id", review.id)
        .eq("user_id", userId)
        .maybeSingle();
      setLiked(!!userLike);
      setLikeId(userLike?.id ?? null);
    };
    fetchLikes();
  }, [review.id, userId]);

  const handleLikeToggle = async () => {
    if (!userId) return;
    setLoading(true);
    if (liked && likeId) {
      const { error } = await supabase
        .from("review_likes")
        .delete()
        .eq("id", likeId);
      if (!error) {
        setLiked(false);
        setLikeId(null);
        setLikeCount((c) => Math.max(0, c - 1));
      }
    } else if (!liked) {
      const { data, error } = await supabase
        .from("review_likes")
        .insert({ review_id: review.id, user_id: userId })
        .select("id")
        .single();
      if (!error && data) {
        setLiked(true);
        setLikeId(data.id);
        setLikeCount((c) => c + 1);
      }
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

        <div className="flex items-center gap-2 mt-2">
          <button
            className={`flex items-center gap-1 px-2 py-1 rounded text-sm border transition-colors ${liked ? "bg-red-100 text-red-600 border-red-300" : "bg-white text-gray-600 border-gray-300"}`}
            onClick={handleLikeToggle}
            disabled={loading}
            aria-label={liked ? "Unlike" : "Like"}
          >
            <Heart
              className={`h-4 w-4 ${liked ? "text-red-600" : "text-gray-400"}`}
              fill={liked ? "#dc2626" : "none"}
            />
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