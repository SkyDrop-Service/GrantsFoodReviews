-- Create food_reviews table
CREATE TABLE public.food_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  food_eaten TEXT NOT NULL,
  food_rating INTEGER NOT NULL CHECK (food_rating >= 1 AND food_rating <= 5),
  speed_rating INTEGER NOT NULL CHECK (speed_rating >= 1 AND speed_rating <= 5),
  service_rating INTEGER NOT NULL CHECK (service_rating >= 1 AND service_rating <= 5),
  description TEXT,
  price_paid DECIMAL(10,2) NOT NULL,
  address TEXT NOT NULL,
  photo_url TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.food_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view food reviews" 
ON public.food_reviews 
FOR SELECT 
USING (true);

-- Create policy for admin insert/update access (for now allowing anyone, can be restricted later)
CREATE POLICY "Anyone can insert food reviews" 
ON public.food_reviews 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update food reviews" 
ON public.food_reviews 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_food_reviews_updated_at
BEFORE UPDATE ON public.food_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for food photos
INSERT INTO storage.buckets (id, name, public) VALUES ('food-photos', 'food-photos', true);

-- Create storage policies
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