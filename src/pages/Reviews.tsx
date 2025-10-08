import { useState } from "react";
import { ReviewCard } from "@/components/ReviewCard";
import { SortControls } from "@/components/SortControls";
import { useFoodReviews } from "@/hooks/useFoodReviews";
import { SortOption } from "@/types/food-review";
import { Loader2, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Reviews = () => {
  const [sortBy, setSortBy] = useState<SortOption>('created_at');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [maxPrice, setMaxPrice] = useState(100);
  const [selectedPrice, setSelectedPrice] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  const [showGrantsPicks, setShowGrantsPicks] = useState(false);
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
    'Italian',
    'Mexican',
    'Chinese',
    'American',
    'Japanese',
    'Dessert',
    'Coffee',
    'Pizza',
    'Seafood',
    'Steak',
    'Alternative',
    'Breakfast',
    'Sandwiches',
    'Sushi',
    'Thai'
  ];

  // Find the highest price_paid in reviews
  const highestPrice = reviews.length > 0 ? Math.max(...reviews.map(r => r.price_paid || 0)) : 100;
  // Update maxPrice and selectedPrice when reviews change
  if (highestPrice !== maxPrice) {
    setMaxPrice(highestPrice);
    setSelectedPrice(highestPrice);
  }

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    const cuisineMatch = selectedCuisine ? review.cuisine === selectedCuisine : true;
    const priceMatch = review.price_paid !== undefined ? review.price_paid <= selectedPrice : true;
    const searchTermLower = searchTerm.toLowerCase();
    const searchMatch = searchTerm
      ? review.name.toLowerCase().includes(searchTermLower)
      : true;
    const grantsPicksMatch = showGrantsPicks ? review.grants_picks === true : true;
    return cuisineMatch && priceMatch && searchMatch && grantsPicksMatch;
  });

  return (
    <>
      <Header backgroundColor={showGrantsPicks ? '#FACF91' : '#CCCCCC'} />
      <div 
        className="min-h-screen transition-colors duration-500 ease-in-out"
        style={{
          backgroundColor: showGrantsPicks ? '#FFE4BD' : '#EDEDED'
        }}
      >
        <div className="container mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-center">Grant's Food Reviews</h1>
            <p className="text-muted-foreground text-center mb-6">
              Discover amazing food spots through Grant's personal dining experiences
            </p>
            <div className="flex flex-col md:flex-row justify-center mb-4 gap-4 items-center">
              <Input
                placeholder="Search places..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
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
              <div className="flex flex-col items-center">
                <label htmlFor="priceRange" className="text-sm mb-1">Max Price: ${selectedPrice}</label>
                <input
                  id="priceRange"
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={selectedPrice}
                  onChange={e => setSelectedPrice(Number(e.target.value))}
                  className="w-40"
                />
              </div>
            </div>
            
            {/* Grant's Picks Button */}
            <div className="flex justify-center mb-6">
              <Button
                onClick={() => setShowGrantsPicks(!showGrantsPicks)}
                variant={showGrantsPicks ? "default" : "outline"}
                className={`flex items-center gap-2 transition-all duration-300 ${showGrantsPicks ? 'text-white' : 'text-[#E68C00] hover:bg-orange-50'}`}
                style={{
                  backgroundColor: showGrantsPicks ? '#E68C00' : 'transparent',
                  borderColor: '#E68C00',
                }}
                onMouseEnter={(e) => {
                  if (showGrantsPicks) {
                    e.currentTarget.style.backgroundColor = '#CC7A00';
                  }
                }}
                onMouseLeave={(e) => {
                  if (showGrantsPicks) {
                    e.currentTarget.style.backgroundColor = '#E68C00';
                  }
                }}
              >
                <Star className="h-4 w-4" />
                Grant's Picks
              </Button>
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