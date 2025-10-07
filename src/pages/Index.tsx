import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import MapEmbed from '@/components/MapEmbed';
import WeatherForecast from '@/components/WeatherForecast';
import { Droplet, Users, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroVideoPlaceholder from '@/assets/hero-video-placeholder.jpg';
import turkanaCommunity from '@/assets/turkana-community.jpg';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section with Video Background */}
        <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
          {/* Video Background - Replace with actual video file */}
          <div className="absolute inset-0 z-0">
            {/* Placeholder - Replace src with your video file path */}
            {/* <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
              <source src="/path-to-your-video.mp4" type="video/mp4" />
            </video> */}
            <img 
              src={heroVideoPlaceholder} 
              alt="Children drinking clean water" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Dark Overlay for Text Clarity */}
          <div className="absolute inset-0 bg-foreground/50 z-10" />
          
          {/* Hero Content */}
          <div className="container mx-auto px-4 z-20 relative">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Access to Clean Water for Turkana Communities
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Discover nearby water sources and help your community thrive with reliable access to clean water
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/water-sources">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Find Water Sources
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Water Access Turkana is dedicated to mapping and sharing the locations of water sources across Turkana County, Kenya. 
                  Our platform helps communities find the nearest clean water sources, reducing travel time and improving access to this vital resource.
                </p>
                <p className="text-lg text-muted-foreground">
                  We work directly with local communities to ensure accurate, up-to-date information that empowers families to access clean water efficiently.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={turkanaCommunity} 
                  alt="Turkana community members" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full mb-4">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Location Mapping</h3>
                <p className="text-muted-foreground">
                  Interactive maps showing exact locations of water sources across Turkana
                </p>
              </div>

              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent text-accent-foreground rounded-full mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Support</h3>
                <p className="text-muted-foreground">
                  Helping thousands of families find reliable water sources near their homes
                </p>
              </div>

              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary text-secondary-foreground rounded-full mb-4">
                  <Droplet className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Clean Water Access</h3>
                <p className="text-muted-foreground">
                  Promoting access to safe, clean water for drinking and daily use
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Weather Forecast Section */}
        <WeatherForecast />

        {/* Challenges & Impact Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Challenges */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Challenges We Address</h2>
                <div className="space-y-4">
                  <div className="bg-card p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">Water Scarcity</h3>
                    <p className="text-muted-foreground">
                      Turkana County faces significant water scarcity challenges, with limited rainfall and distant water sources making daily water access difficult.
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">Long Travel Distances</h3>
                    <p className="text-muted-foreground">
                      Many communities must travel several kilometers to access water, consuming valuable time and energy.
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">Information Gap</h3>
                    <p className="text-muted-foreground">
                      Lack of centralized information about water source locations makes it harder for communities to find the nearest available water.
                    </p>
                  </div>
                </div>
              </div>

              {/* Impact */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Impact</h2>
                <div className="space-y-4">
                  <div className="bg-card p-6 rounded-lg shadow-sm border-l-4 border-accent">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="h-6 w-6 text-accent" />
                      <h3 className="font-semibold text-lg">Reduced Travel Time</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Helping communities save hours each day by finding the nearest water sources
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg shadow-sm border-l-4 border-primary">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-6 w-6 text-primary" />
                      <h3 className="font-semibold text-lg">Community Empowerment</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Providing accessible information that empowers communities to make informed decisions
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg shadow-sm border-l-4 border-secondary">
                    <div className="flex items-center gap-3 mb-2">
                      <Droplet className="h-6 w-6 text-secondary" />
                      <h3 className="font-semibold text-lg">Improved Health</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Better access to clean water contributes to improved health and well-being
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Turkana Region</h2>
              <p className="text-lg text-muted-foreground">
                Explore the Turkana region and discover where our water sources are located
              </p>
            </div>
            <MapEmbed />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Water Sources?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Explore our interactive map to locate water sources near you
            </p>
            <Link to="/water-sources">
              <Button size="lg" className="bg-background hover:bg-background/90 text-primary">
                View Water Sources Map
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
