import { Button, buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import ContactForm from "@/components/ContactForm";

const Index = () => {
  const navigate = useNavigate();

  const [showContact, setShowContact] = useState(false);
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Grant's Food Reviews
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover amazing food spots through Grant's personal dining experiences
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/reviews")} size="lg">
                View All Reviews
              </Button>
              <Button onClick={() => navigate("/map")} variant="outline" size="lg">
                <MapPin className="mr-2 h-4 w-4" />
                Map View
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle>Quality Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Detailed ratings for food quality, service speed, and overall experience
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle>Location Mapping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Interactive map showing all reviewed restaurants with precise locations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle>Smart Sorting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Sort reviews by rating, price, location, or date added to find exactly what you want
                </p>
              </CardContent>
            </Card>
          </div>

          {/* HD Logo below main cards */}
          <div className="flex flex-col items-center mt-8">
            <img src="/grantFoodReview-Transparent.png" alt="Grant's Food Review Logo" className="h-40 w-auto mb-4 drop-shadow-lg" />
            <div className="flex gap-4 mb-4">
              <Button variant="secondary" onClick={() => setShowContact((v) => !v)}>
                Contact Me
              </Button>
              <a
                href="https://ko-fi.com/gnhen"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "secondary" }) + " font-semibold"}
                style={{ backgroundColor: '#FF6433', color: '#fff', border: 'none' }}
              >
                Buy me a Coffee
              </a>
            </div>
            {showContact && <ContactForm />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
