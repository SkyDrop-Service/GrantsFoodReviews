import { useState } from "react";
import { Header } from "@/components/Header";
import { AwardCard } from "@/components/AwardCard";
import { useFoodReviews } from "@/hooks/useFoodReviews";
import { useAwards } from "@/hooks/useAwards";
import { FoodReview } from "@/types/food-review";

interface AwardWithWinner {
  id: string;
  title: string;
  category: string;
  winner: FoodReview;
}

const Awards = () => {
  const { reviews, loading: reviewsLoading } = useFoodReviews();
  const { awards: awardTypes, loading: awardsLoading } = useAwards();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  if (reviewsLoading || awardsLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEDED' }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </>
    );
  }

  // Create awards with winners based on database data
  const awards: AwardWithWinner[] = awardTypes
    .map(awardType => {
      const winner = reviews.find(r => r.awards?.includes(awardType.id));
      return winner ? {
        id: awardType.id,
        title: awardType.title,
        category: awardType.category,
        winner
      } : null;
    })
    .filter((award): award is AwardWithWinner => award !== null);

  const handleCardClick = (awardId: string) => {
    setExpandedCard(expandedCard === awardId ? null : awardId);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen" style={{ backgroundColor: '#EDEDED' }}>
        <div className="container mx-auto py-8">
          <div className="text-center mb-12">
            <h1 
              className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
              style={{ 
                backgroundImage: 'linear-gradient(to right, #EAB308, #CA8A04)' 
              }}
            >
              🏆 Awards
            </h1>
            <p className="text-xl text-muted-foreground">
              Grant's top picks across different categories
            </p>
          </div>

          {awards.length > 0 ? (
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
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">No Awards Yet</h3>
              <p className="text-muted-foreground">
                Awards will appear here once they are assigned to reviews.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Awards;