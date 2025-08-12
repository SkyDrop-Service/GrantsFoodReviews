import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  readOnly?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export const StarRating = ({ rating, readOnly = true, onRatingChange, className }: StarRatingProps) => {
  return (
    <div className={cn("flex gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= rating 
              ? "fill-primary text-primary" 
              : "fill-muted text-muted-foreground",
            !readOnly && "cursor-pointer hover:text-primary transition-colors"
          )}
          onClick={() => !readOnly && onRatingChange?.(star)}
        />
      ))}
    </div>
  );
};