import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, MapPin, DollarSign, Star, Heart } from "lucide-react";
import { StarRating } from "./StarRating";
import { FoodReview } from "@/types/food-review";
import { openInMaps } from "@/utils/maps";

interface Award {
  id: string;
  title: string;
  category: string;
  winner: FoodReview;
}

interface AwardCardProps {
  award: Award;
  isExpanded: boolean;
  onClick: () => void;
}

export const AwardCard = ({ award, isExpanded, onClick }: AwardCardProps) => {
  return (
    <div className="relative w-full aspect-square perspective-1000">
      <div 
        className={`relative w-full h-full transition-transform duration-700 preserve-3d cursor-pointer ${
          isExpanded ? 'rotate-y-180' : ''
        }`}
        onClick={onClick}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front side - Award Card */}
        <Card 
          className="absolute inset-0 w-full h-full backface-hidden hover:shadow-xl transition-shadow duration-300"
          style={{ 
            backfaceVisibility: 'hidden',
            backgroundColor: '#FAD269',
            borderColor: '#FAD269'
          }}
        >
          <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-6xl">🏆</span>
            
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-gray-800">{award.title}</h3>
              <p className="text-sm text-gray-700 font-medium">{award.winner.name}</p>
              <Badge 
                className="text-xs text-white border-yellow-400"
                style={{ backgroundColor: '#EAB308', borderColor: '#D97706' }}
              >
                {award.category}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Back side - Full Review Card */}
        <Card 
          className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 hover:shadow-xl transition-shadow overflow-y-auto"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center mb-2">
              <Badge 
                className="text-xs font-bold px-2 py-1 text-white"
                style={{ backgroundColor: '#EAB308' }}
              >
                🏆 {award.title} Winner
              </Badge>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {award.winner.grants_picks && (
                <Star className="h-4 w-4 text-[#E68C00] fill-[#E68C00]" />
              )}
              {award.winner.awards && award.winner.awards.length > 0 && (
                <span className="text-lg">🏆</span>
              )}
              <CardTitle className="text-lg">{award.winner.name}</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div 
                className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors group"
                onClick={(e) => {
                  e.stopPropagation();
                  openInMaps(award.winner.address, award.winner.latitude, award.winner.longitude);
                }}
              >
                <MapPin className="h-4 w-4 group-hover:text-blue-600" />
                <span className="group-hover:underline text-xs">{award.winner.address}</span>
              </div>
              {award.winner.cuisine && (
                <span className="ml-2 px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-semibold">
                  {award.winner.cuisine}
                </span>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-4 space-y-3">
            {award.winner.photo_url && (
              <div className="aspect-video w-full overflow-hidden rounded-md">
                <img
                  src={award.winner.photo_url}
                  alt={award.winner.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <p className="font-medium text-xs text-muted-foreground mb-1">Food Eaten</p>
              <p className="text-sm">{award.winner.food_eaten}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="font-medium text-xs text-muted-foreground mb-1">Food</p>
                <StarRating rating={award.winner.food_rating} />
              </div>
              <div>
                <p className="font-medium text-xs text-muted-foreground mb-1">Speed</p>
                <StarRating rating={award.winner.speed_rating} />
              </div>
              <div>
                <p className="font-medium text-xs text-muted-foreground mb-1">Service</p>
                <StarRating rating={award.winner.service_rating} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <Badge variant="secondary">${award.winner.price_paid}</Badge>
            </div>

            {award.winner.description && (
              <div>
                <p className="font-medium text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-xs leading-relaxed">{award.winner.description}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-2 py-1 rounded text-xs border bg-white text-gray-600 border-gray-300">
                <Heart className="h-3 w-3 text-gray-400" />
                0
              </button>
              <span className="text-xs text-muted-foreground">Like this review</span>
            </div>

            <div className="text-xs text-muted-foreground">
              Added {new Date(award.winner.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};