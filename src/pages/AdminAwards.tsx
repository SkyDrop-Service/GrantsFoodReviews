import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFoodReviews } from "@/hooks/useFoodReviews";
import { FoodReview } from "@/types/food-review";
import { Trophy, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
    { id: 'best-pizza', title: 'Best Pizza', category: 'Pizza' },
    { id: 'best-burger', title: 'Best Burger', category: 'American' },
    { id: 'best-sushi', title: 'Best Sushi', category: 'Sushi' },
    { id: 'highest-rated', title: 'Highest Rated', category: 'Overall' },
    { id: 'best-value', title: 'Best Value', category: 'Value' },
    { id: 'most-expensive', title: 'Most Premium', category: 'Luxury' },
  ]);

  const [newAwardTitle, setNewAwardTitle] = useState('');
  const [newAwardCategory, setNewAwardCategory] = useState('');

  // Load current awards on mount
  useEffect(() => {
    if (reviews.length > 0) {
      const updatedAwards = awards.map(award => {
        const currentWinner = reviews.find(r => r.awards?.includes(award.id));
        return { ...award, currentWinner: currentWinner?.id };
      });
      setAwards(updatedAwards);
    }
  }, [reviews]);

  const handleAwardChange = (awardId: string, reviewId: string) => {
    setAwards(prev => prev.map(award => 
      award.id === awardId 
        ? { ...award, currentWinner: reviewId }
        : award
    ));
  };

  const addNewAward = () => {
    if (!newAwardTitle.trim() || !newAwardCategory.trim()) {
      alert('Please enter both title and category for the new award');
      return;
    }

    const newAwardId = newAwardTitle.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if award with this ID already exists
    if (awards.some(award => award.id === newAwardId)) {
      alert('An award with this title already exists');
      return;
    }

    const newAward: Award = {
      id: newAwardId,
      title: newAwardTitle.trim(),
      category: newAwardCategory.trim(),
      currentWinner: ''
    };

    setAwards(prev => [...prev, newAward]);
    setNewAwardTitle('');
    setNewAwardCategory('');
  };

  const removeAward = (awardId: string) => {
    if (confirm('Are you sure you want to remove this award? This will also remove it from any reviews that currently have it.')) {
      setAwards(prev => prev.filter(award => award.id !== awardId));
    }
  };

  const saveAwards = async () => {
    try {
      // First, clear all awards from all reviews
      await supabase
        .from('food_reviews')
        .update({ awards: [] })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      // Then assign new awards
      for (const award of awards) {
        if (award.currentWinner) {
          const review = reviews.find(r => r.id === award.currentWinner);
          if (review) {
            const currentAwards = review.awards || [];
            const newAwards = [...currentAwards.filter(a => a !== award.id), award.id];
            
            await supabase
              .from('food_reviews')
              .update({ awards: newAwards })
              .eq('id', award.currentWinner);
          }
        }
      }

      console.log('Awards saved successfully');
      navigate('/admin');
    } catch (error) {
      console.error('Error saving awards:', error);
      alert('Error saving awards. Please try again.');
    }
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
                Manage award categories and select winners
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

          {/* Add New Award Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-600" />
                Add New Award Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Award Title</label>
                  <Input
                    placeholder="e.g., Best Tacos"
                    value={newAwardTitle}
                    onChange={(e) => setNewAwardTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Input
                    placeholder="e.g., Mexican"
                    value={newAwardCategory}
                    onChange={(e) => setNewAwardCategory(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={addNewAward}
                    className="w-full"
                    disabled={!newAwardTitle.trim() || !newAwardCategory.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Award
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Existing Awards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {awards.map((award) => {
              const currentWinner = reviews.find(r => r.id === award.currentWinner);
              
              return (
                <Card key={award.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                        {award.title}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAward(award.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Category: {award.category}</p>
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

          {awards.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No awards created yet. Add your first award above!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminAwards;