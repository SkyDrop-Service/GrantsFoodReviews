-- Create the food_reviews table
CREATE TABLE public.food_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  food_eaten TEXT NOT NULL,
  description TEXT,
  food_rating INTEGER NOT NULL CHECK (food_rating >= 1 AND food_rating <= 5),
  speed_rating INTEGER NOT NULL CHECK (speed_rating >= 1 AND speed_rating <= 5),
  service_rating INTEGER NOT NULL CHECK (service_rating >= 1 AND service_rating <= 5),
  price_paid NUMERIC NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.food_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public review site)
CREATE POLICY "Anyone can view food reviews" 
ON public.food_reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert food reviews" 
ON public.food_reviews 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update food reviews" 
ON public.food_reviews 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_food_reviews_updated_at
BEFORE UPDATE ON public.food_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for food photos
INSERT INTO storage.buckets (id, name, public) VALUES ('food-photos', 'food-photos', true);

-- Create storage policies for food photos
CREATE POLICY "Anyone can view food photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'food-photos');

CREATE POLICY "Anyone can upload food photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'food-photos');

CREATE POLICY "Anyone can update food photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'food-photos');