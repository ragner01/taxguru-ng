import { ArrowRight, Calculator, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/tax-hero.jpg";

const Hero = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 hero-gradient opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Calculate Your 
                <span className="text-gradient block">Nigerian Taxes</span>
                with Confidence
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Accurate, FIRS-compliant tax calculations for individuals and businesses. 
                Get instant results for Personal Income Tax, VAT, Company Tax, and more.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>FIRS Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>For Everyone</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-glow text-primary-foreground group"
                onClick={() => {
                  const calculatorsSection = document.getElementById('calculators');
                  if (calculatorsSection) {
                    calculatorsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Start Calculating
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => {
                  // Navigate to the tax education page
                  window.location.href = '/tax-education';
                }}
              >
                Learn About Taxes
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-in">
            <div className="relative z-10">
              <img 
                src={heroImage} 
                alt="Tax Calculator Interface" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-bounce-gentle"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-bounce-gentle delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;