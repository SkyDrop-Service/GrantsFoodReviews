import { useState } from "react";
import { ReviewCard } from "@/components/ReviewCard";
import { SortControls } from "@/components/SortControls";
import { useFoodReviews } from "@/hooks/useFoodReviews";
import { SortOption } from "@/types/food-review";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/Header";

const Reviews = () => {
  const [sortBy, setSortBy] = useState<SortOption>('created_at');
  const { reviews, loading } = useFoodReviews(sortBy);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-center">Grant's Food Reviews</h1>
            <p className="text-muted-foreground text-center mb-6">
              Discover amazing food spots through Grant's personal dining experiences
            </p>
            <div className="flex justify-center">
              <SortControls sortBy={sortBy} onSortChange={setSortBy} />
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No reviews yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Reviews;