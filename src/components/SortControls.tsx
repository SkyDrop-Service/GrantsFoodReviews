import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption } from "@/types/food-review";

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortControls = ({ sortBy, onSortChange }: SortControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Sort by:</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at">Recently Added</SelectItem>
          <SelectItem value="name">Restaurant Name (A-Z)</SelectItem>
          <SelectItem value="food_rating">Food Rating</SelectItem>
          <SelectItem value="speed_rating">Speed Rating</SelectItem>
          <SelectItem value="service_rating">Service Rating</SelectItem>
          <SelectItem value="price_paid">Price (Low to High)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};