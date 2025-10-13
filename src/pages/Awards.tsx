import { useState } from "react";
import { Header } from "@/components/Header";
import { AwardCard } from "@/components/AwardCard";
import { useFoodReviews } from "@/hooks/useFoodReviews";
import { FoodReview } from "@/types/food-review";

interface Award {
  id: string;
  title: string;
  category: string;
  winner: FoodReview;
}

const Awards = () => {
  const { reviews, loading } = useFoodReviews();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

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

  // Define awards based on your reviews
  const awards: Award[] = [
    {
      id: 'best-pizza',
      title: 'Best Pizza',
      category: 'Pizza',
      winner: reviews.find(r => r.cuisine === 'Pizza') || reviews[0]
    },
    {
      id: 'best-burger',
      title: 'Best Burger', 
      category: 'American',
      winner: reviews.find(r => r.food_eaten.toLowerCase().includes('burger')) || reviews[1]
    },
    {
      id: 'best-sushi',
      title: 'Best Sushi',
      category: 'Sushi',
      winner: reviews.find(r => r.cuisine === 'Sushi') || reviews[2]
    },
    {
      id: 'highest-rated',
      title: 'Highest Rated',
      category: 'Overall',
      winner: reviews.reduce((prev, current) => (prev.rating > current.rating) ? prev : current, reviews[0])
    },
    {
      id: 'best-value',
      title: 'Best Value',
      category: 'Value',
      winner: reviews.reduce((prev, current) => {
        const prevValue = prev.rating / (prev.price_paid || 1);
        const currentValue = current.rating / (current.price_paid || 1);
        return prevValue > currentValue ? prev : current;
      }, reviews[0])
    },
    {
      id: 'most-expensive',
      title: 'Most Premium',
      category: 'Luxury',
      winner: reviews.reduce((prev, current) => ((prev.price_paid || 0) > (current.price_paid || 0)) ? prev : current, reviews[0])
    }
  ];

  const handleCardClick = (awardId: string) => {
    setExpandedCard(expandedCard === awardId ? null : awardId);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen" style={{ backgroundColor: '#EDEDED' }}>
        <div className="container mx-auto py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-700 to-yellow-800 bg-clip-text text-transparent">
              "Best Of" Awards
            </h1>
            <p className="text-xl text-muted-foreground">
              Grant's top picks across different categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {awards.map((award) => (
              <AwardCard
                key={award.id}
                award={award}
                isExpanded={expandedCard === award.id}
                onClick={() => handleCardClick(award.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Awards;