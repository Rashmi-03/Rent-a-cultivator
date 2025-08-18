import { Button } from "@/components/ui/button";
import { ArrowRight, Tractor, Users, Shield } from "lucide-react";
import heroImage from "@/assets/tractor-stock.jpg";
import machinesImage from "@/assets/harvester-stock.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-primary/70"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Tractor className="h-12 w-12 text-agriculture-gold" />
            <h1 className="text-5xl md:text-7xl font-bold">
              Rent a <span className="text-agriculture-gold">Cultivator</span>
            </h1>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-semibold text-primary-foreground/90">
            Modern Agricultural Equipment Rental Platform
          </h2>
          
          <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Access premium farming equipment when you need it. From tractors to harvesters, 
            rent quality machinery to boost your agricultural productivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              variant="agriculture" 
              size="lg"
              onClick={onGetStarted}
              className="text-lg px-8 py-4 h-auto"
            >
              Get Started
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4 h-auto bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Browse Equipment
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 bg-agriculture-gold/20 rounded-full flex items-center justify-center">
                <Tractor className="h-8 w-8 text-agriculture-gold" />
              </div>
              <h3 className="text-xl font-semibold">Premium Equipment</h3>
              <p className="text-primary-foreground/70">
                Latest models from top manufacturers, maintained to the highest standards
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 bg-agriculture-gold/20 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-agriculture-gold" />
              </div>
              <h3 className="text-xl font-semibold">Expert Support</h3>
              <p className="text-primary-foreground/70">
                24/7 customer support and on-site assistance when you need it
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 bg-agriculture-gold/20 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-agriculture-gold" />
              </div>
              <h3 className="text-xl font-semibold">Fully Insured</h3>
              <p className="text-primary-foreground/70">
                Comprehensive insurance coverage for peace of mind during rentals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Showcase */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="bg-gradient-to-t from-background/95 to-transparent pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="relative rounded-lg overflow-hidden shadow-strong">
              <img 
                src={machinesImage} 
                alt="Agricultural Equipment Collection"
                className="w-full h-32 md:h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center">
                <div className="text-white p-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    50+ Premium Machines Available
                  </h3>
                  <p className="text-primary-foreground/90">
                    Tractors, Harvesters, Plows, and more...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};