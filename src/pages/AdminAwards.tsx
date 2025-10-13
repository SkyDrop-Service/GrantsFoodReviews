import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFoodReviews } from "@/hooks/useFoodReviews";
import { FoodReview } from "@/types/food-review";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Award {
  id: string;
  title: string;
  category: string;
  currentWinner?: string; // Review ID
}

const AdminAwards = () => {
  const navigate = useNavigate();
  const { reviews, loading } = useFoodReviews();
  
  const [awards, setAwards] = useState<Award[]>([
    { id: 'best-pizza', title: 'Best Pizza', category: 'Pizza', currentWinner: '1' },
    { id: 'best-burger', title: 'Best Burger', category: 'American', currentWinner: '2' },
    { id: 'best-sushi', title: 'Best Sushi', category: 'Sushi', currentWinner: '3' },
    { id: 'highest-rated', title: 'Highest Rated', category: 'Overall', currentWinner: '3' },
    { id: 'best-value', title: 'Best Value', category: 'Value', currentWinner: '4' },
    { id: 'most-expensive', title: 'Most Premium', category: 'Luxury', currentWinner: '3' },
  ]);

  const handleAwardChange = (awardId: string, reviewId: string) => {
    setAwards(prev => prev.map(award => 
      award.id === awardId 
        ? { ...award, currentWinner: reviewId }
        : award
    ));
  };

  const saveAwards = () => {
    // Here you would save to your backend/Supabase
    console.log('Saving awards:', awards);
    // Show success toast
    navigate('/admin');
  };

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

  return (
    <>
      <Header />
      <div className="min-h-screen" style={{ backgroundColor: '#EDEDED' }}>
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Edit Awards</h1>
              <p className="text-muted-foreground">
                Select which review wins each award category
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => navigate('/admin')}>
                Cancel
              </Button>
              <Button onClick={saveAwards}>
                Save Awards
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {awards.map((award) => {
              const currentWinner = reviews.find(r => r.id === award.currentWinner);
              
              return (
                <Card key={award.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      {award.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Current Winner: {currentWinner?.name || 'None selected'}
                        </label>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Select Winner:
                        </label>
                        <select
                          value={award.currentWinner || ''}
                          onChange={(e) => handleAwardChange(award.id, e.target.value)}
                          className="w-full border rounded px-3 py-2 bg-white"
                        >
                          <option value="">No winner</option>
                          {reviews.map((review) => (
                            <option key={review.id} value={review.id}>
                              {review.name} - {review.food_eaten}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {currentWinner && (
                        <div className="p-3 bg-gray-50 rounded-md">
                          <p className="text-sm"><strong>Restaurant:</strong> {currentWinner.name}</p>
                          <p className="text-sm"><strong>Food:</strong> {currentWinner.food_eaten}</p>
                          <p className="text-sm"><strong>Rating:</strong> {currentWinner.rating}/5</p>
                          <p className="text-sm"><strong>Price:</strong> ${currentWinner.price_paid}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAwards;