import { useState } from "react";
import { ReviewCard } from "@/components/ReviewCard";
import { SortControls } from "@/components/SortControls";
import { useFoodReviews } from "@/hooks/useFoodReviews";
import { SortOption } from "@/types/food-review";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/Header";

const Reviews = () => {
  const [sortBy, setSortBy] = useState<SortOption>('created_at');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
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

  // Cuisine and price options
  const cuisineOptions = [
    'American', 'Mexican', 'Italian', 'Chinese', 'Indian', 'Thai', 'Mediterranean', 'French', 'Japanese', 'Korean', 'Vietnamese', 'Greek', 'BBQ', 'Seafood', 'Pizza', 'Burgers', 'Sandwiches', 'Sushi', 'Desserts', 'Other'
  ];
  const priceOptions = [
    { label: '$', value: 1 },
    { label: '$$', value: 2 },
    { label: '$$$', value: 3 },
    { label: '$$$$', value: 4 }
  ];

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    const cuisineMatch = selectedCuisine ? review.cuisine === selectedCuisine : true;
    const priceMatch = selectedPrice ? review.price_paid && Math.round(review.price_paid) === Number(selectedPrice) : true;
    return cuisineMatch && priceMatch;
  });

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
            <div className="flex justify-center mb-4 gap-4">
              <SortControls sortBy={sortBy} onSortChange={setSortBy} />
              <select
                value={selectedCuisine}
                onChange={e => setSelectedCuisine(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">All Cuisines</option>
                {cuisineOptions.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
              <select
                value={selectedPrice}
                onChange={e => setSelectedPrice(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">All Prices</option>
                {priceOptions.map(option => (
                  <option key={option.value} value={String(option.value)}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No reviews match your filters. Try another cuisine or price range!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
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