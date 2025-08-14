import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { StarRating } from "@/components/StarRating";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FoodReview } from "@/types/food-review";

interface ReviewFormData {
  name: string;
  food_eaten: string;
  food_rating: number;
  speed_rating: number;
  service_rating: number;
  description: string;
  price_paid: number;
  address: string;
  photo_url?: string;
  cuisine?: string;
}

const Admin = () => {
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const [editingReview, setEditingReview] = useState<FoodReview | null>(null);
  const [reviews, setReviews] = useState<FoodReview[]>([]);
  const [view, setView] = useState<'add' | 'edit' | null>(null);
  const [locationType, setLocationType] = useState<'address' | 'coordinates'>('address');
  const form = useForm<ReviewFormData>({
    defaultValues: {
      name: "",
      food_eaten: "",
      food_rating: 5,
      speed_rating: 5,
      service_rating: 5,
      description: "",
      price_paid: 0,
      address: "",
      photo_url: "",
      cuisine: "",
    },
  });

  useEffect(() => {
    if (!authLoading && !session) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, session, navigate]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data: reviewList, error: fetchError } = await supabase
        .from('food_reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (fetchError) {
        toast({
          title: "Error",
          description: "Failed to load reviews",
          variant: "destructive",
        });
        return;
      }
      setReviews(reviewList || []);
    };
    fetchReviews();
  }, [toast]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = fileName;
      const { error: uploadError } = await supabase.storage
        .from('food-photos')
        .upload(filePath, file);
      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }
      const { data } = supabase.storage
        .from('food-photos')
        .getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Photo upload error:', error);
      return null;
    }
  };

  // Geocode address using Nominatim API
  async function geocodeAddress(address: string): Promise<{ latitude?: number; longitude?: number }> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
      const response = await fetch(url);
      const results = await response.json();
      console.log('Geocoding results for address:', address, results);
      if (results && results.length > 0) {
        return {
          latitude: parseFloat(results[0].lat),
          longitude: parseFloat(results[0].lon),
        };
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    }
    return {};
  }

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setLoading(true);
      let photo_url = data.photo_url || null;
      if (photo) {
        photo_url = await uploadPhoto(photo);
        if (!photo_url) {
          toast({
            title: "Error",
            description: "Failed to upload photo",
            variant: "destructive",
          });
          return;
        }
      }

      let latitude, longitude;
      if (locationType === 'address' && data.address) {
        const geo = await geocodeAddress(data.address);
        latitude = geo.latitude;
        longitude = geo.longitude;
      } else if (locationType === 'coordinates' && data.address) {
        // Parse coordinates in format '39.20016° N, 84.26138° W'
        const regex = /([\d.]+)°\s*([NS]),\s*([\d.]+)°\s*([EW])/i;
        const match = data.address.match(regex);
        if (match) {
          latitude = parseFloat(match[1]) * (match[2].toUpperCase() === 'S' ? -1 : 1);
          longitude = parseFloat(match[3]) * (match[4].toUpperCase() === 'W' ? -1 : 1);
        } else {
          toast({
            title: "Error",
            description: "Invalid coordinates format. Use 39.20016° N, 84.26138° W",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      const reviewData = {
        ...data,
        photo_url,
        latitude,
        longitude,
      };
      console.log('Review data to be saved:', reviewData);
      let submitError;
      if (editingReview) {
        ({ error: submitError } = await supabase
          .from('food_reviews')
          .update(reviewData)
          .eq('id', editingReview.id));
      } else {
        ({ error: submitError } = await supabase
          .from('food_reviews')
          .insert([reviewData]));
      }
      if (submitError) {
        console.error('Save error:', submitError);
        toast({
          title: "Error",
          description: "Failed to save review",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: editingReview ? "Review updated successfully!" : "Review added successfully!",
      });
      form.reset();
      setPhoto(null);
      setPhotoPreview(null);
      setEditingReview(null);
      const { data: reviewList, error: fetchError } = await supabase
        .from('food_reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (!fetchError) setReviews(reviewList || []);
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        {view === null && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl py-24">
            <Card className="cursor-pointer h-64 flex flex-col items-center justify-center text-center text-3xl font-bold shadow-lg hover:scale-105 transition-transform" onClick={() => setView('add')}>
              <CardContent>
                Add Review
              </CardContent>
            </Card>
            <Card className="cursor-pointer h-64 flex flex-col items-center justify-center text-center text-3xl font-bold shadow-lg hover:scale-105 transition-transform" onClick={() => setView('edit')}>
              <CardContent>
                Edit Reviews
              </CardContent>
            </Card>
          </div>
        )}
        {view === 'add' && (
          <div className="w-full max-w-2xl mx-auto py-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">{editingReview ? 'Edit Review' : 'Add New Food Review'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Restaurant Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter restaurant name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="food_eaten"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Food Eaten</FormLabel>
                          <FormControl>
                            <Input placeholder="What did you eat?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cuisine"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cuisine</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="block w-full border rounded px-2 py-2 text-sm"
                            >
                              <option value="">Select cuisine</option>
                              <option value="Italian">Italian</option>
                              <option value="Mexican">Mexican</option>
                              <option value="Chinese">Chinese</option>
                              <option value="American">American</option>
                              <option value="Japanese">Japanese</option>
                              <option value="Dessert">Dessert</option>
                              <option value="Coffee">Coffee</option>
                              <option value="Pizza">Pizza</option>
                              <option value="Seafood">Seafood</option>
                              <option value="Steak">Steak</option>
                              <option value="Alternative">Alternative</option>
                              <option value="Breakfast">Breakfast</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="food_rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Food Rating</FormLabel>
                            <FormControl>
                              <StarRating
                                rating={field.value}
                                readOnly={false}
                                onRatingChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="speed_rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Speed Rating</FormLabel>
                            <FormControl>
                              <StarRating
                                rating={field.value}
                                readOnly={false}
                                onRatingChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="service_rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Rating</FormLabel>
                            <FormControl>
                              <StarRating
                                rating={field.value}
                                readOnly={false}
                                onRatingChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="price_paid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Paid ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-2">
                      <div className="flex gap-4 items-center">
                        <label className="text-sm font-medium">Location Type:</label>
                        <Button type="button" variant={locationType === 'address' ? 'default' : 'outline'} size="sm" onClick={() => setLocationType('address')}>Address</Button>
                        <Button type="button" variant={locationType === 'coordinates' ? 'default' : 'outline'} size="sm" onClick={() => setLocationType('coordinates')}>Coordinates</Button>
                      </div>
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{locationType === 'address' ? 'Address' : 'Coordinates'}</FormLabel>
                            <FormControl>
                              <Input placeholder={locationType === 'address' ? 'Restaurant address' : '39.20016° N, 84.26138° W'} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Photo Upload</label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="flex-1"
                        />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {photoPreview && (
                        <div className="mt-2">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-md"
                          />
                        </div>
                      )}
                      <FormField
                        control={form.control}
                        name="photo_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Or Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share your experience..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-4">
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingReview ? 'Update Review' : 'Add Review'}
                      </Button>
                      <Button type="button" variant="secondary" className="w-full" onClick={() => { setEditingReview(null); form.reset(); setPhoto(null); setPhotoPreview(null); setView(null); }}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}
        {view === 'edit' && (
          <div className="w-full max-w-2xl mx-auto py-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Edit Existing Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-muted-foreground">No reviews found.</div>
                ) : (
                  <div className="space-y-2">
                    {reviews.map(review => (
                      <div key={review.id} className="mb-2 flex items-center gap-2">
                        <span className="font-medium">{review.name}</span>
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingReview(review);
                          form.reset({
                            name: review.name,
                            food_eaten: review.food_eaten,
                            food_rating: review.food_rating,
                            speed_rating: review.speed_rating,
                            service_rating: review.service_rating,
                            description: review.description || "",
                            price_paid: review.price_paid,
                            address: review.address,
                            photo_url: review.photo_url || "",
                            cuisine: review.cuisine || "",
                          });
                          setView('add');
                        }}>
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <Button type="button" variant="secondary" className="w-full mt-8" onClick={() => setView(null)}>
                  Back
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;
