import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TaxCalculators from "@/components/TaxCalculators";
import PersonalIncomeTaxCalculator from "@/components/PersonalIncomeTaxCalculator";
import TaxHistoryTracker from "@/components/TaxHistoryTracker";
import TaxCalendar from "@/components/TaxCalendar";
import TaxSavingsCalculator from "@/components/TaxSavingsCalculator";
import TaxRatesLookup from "@/components/TaxRatesLookup";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { username } = useAuth();
  const friendlyName = username || "there";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="bg-primary/10 border-b border-primary/20">
        <div className="container mx-auto flex flex-col gap-2 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-primary">Dashboard</p>
            <h2 className="text-2xl font-semibold text-foreground">
              Welcome back, <span className="text-primary">{friendlyName}</span> 👋
            </h2>
            <p className="text-sm text-muted-foreground">
              Continue planning your tax obligations with the latest 2026 reform updates.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-primary text-primary"
            onClick={() => {
              const calculatorsSection = document.getElementById("calculators");
              if (calculatorsSection) {
                calculatorsSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Jump to calculators
          </Button>
        </div>
      </section>
      <Hero />
      
      {/* Tax Information Section */}
      <section id="tax-info" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Learn About <span className="text-gradient">Nigerian Taxes</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Understanding Nigerian tax laws and regulations is crucial for compliance and financial planning. 
              Here's what you need to know about the main types of taxes in Nigeria.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Personal Income Tax */}
            <div className="bg-background p-6 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Personal Income Tax</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Progressive tax rates now run from 0% to 25% with a ₦800,000 tax-free threshold, rent relief (20% capped at ₦500k), and withholding tax offsets.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>₦0 - ₦800,000:</span>
                  <span className="font-semibold">0%</span>
                </div>
                <div className="flex justify-between">
                  <span>₦800,001 - ₦3,000,000:</span>
                  <span className="font-semibold">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Above ₦50,000,000:</span>
                  <span className="font-semibold">25%</span>
                </div>
              </div>
            </div>

            {/* VAT */}
            <div className="bg-background p-6 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Value Added Tax (VAT)</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Standard rate of 7.5% on most goods and services. Some items are exempt or zero-rated.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Standard Rate:</span>
                  <span className="font-semibold">7.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Zero-rated:</span>
                  <span className="font-semibold">0%</span>
                </div>
                <div className="flex justify-between">
                  <span>Exempt items:</span>
                  <span className="font-semibold">No VAT</span>
                </div>
              </div>
            </div>

            {/* Company Income Tax */}
            <div className="bg-background p-6 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Company Income Tax</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Corporate tax obligations include a 4% development levy and a 15% minimum effective tax rate for very large groups, while compliant small companies remain exempt.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Small Companies:</span>
                  <span className="font-semibold">0% (CIT, CGT & levy)</span>
                </div>
                <div className="flex justify-between">
                  <span>Medium Companies:</span>
                  <span className="font-semibold">30% + 4% levy</span>
                </div>
                <div className="flex justify-between">
                  <span>Large Groups:</span>
                  <span className="font-semibold">≥15% ETR + levy</span>
                </div>
              </div>
            </div>

            {/* Capital Gains Tax */}
            <div className="bg-background p-6 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Capital Gains Tax</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                From January 2026, individuals report gains through the personal income tax bands while companies face a higher CGT burden on disposals and offshore transfers.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Individuals (2026+):</span>
                  <span className="font-semibold">0%–25% PIT bands</span>
                </div>
                <div className="flex justify-between">
                  <span>Legacy filings (≤2025):</span>
                  <span className="font-semibold">10% flat CGT</span>
                </div>
                <div className="flex justify-between">
                  <span>Companies:</span>
                  <span className="font-semibold">30% CGT + 4% levy</span>
                </div>
              </div>
            </div>

            {/* Withholding Tax */}
            <div className="bg-background p-6 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Withholding Tax</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Withholding tax credits still apply at source, now emphasising faster monthly reconciliations and offsets against the updated PIT and CIT liabilities.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Resident services:</span>
                  <span className="font-semibold">5%–10%</span>
                </div>
                <div className="flex justify-between">
                  <span>Non-resident payments:</span>
                  <span className="font-semibold">10%</span>
                </div>
                <div className="flex justify-between">
                  <span>Digital/aviation levy:</span>
                  <span className="font-semibold">2%–4% on gross</span>
                </div>
              </div>
            </div>

            {/* Stamp Duty */}
            <div className="bg-background p-6 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Stamp Duty</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Tax on legal documents and instruments. Rates vary based on document type and value.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Property Transfer:</span>
                  <span className="font-semibold">0.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Loan Agreements:</span>
                  <span className="font-semibold">0.125%</span>
                </div>
                <div className="flex justify-between">
                  <span>Legal Documents:</span>
                  <span className="font-semibold">Fixed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              Rates reflect the 2025 Tax Reform Acts (effective 1 January 2026). For granular thresholds or sector-specific reliefs, review the latest circulars on the official FIRS website.
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-glow text-primary-foreground"
              onClick={() => {
                const calculatorsSection = document.getElementById('calculators');
                if (calculatorsSection) {
                  calculatorsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Start Calculating Your Taxes
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="ml-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => {
                navigate('/tax-education');
              }}
            >
              Learn More About Taxes
            </Button>
          </div>
        </div>
      </section>
      
      <TaxCalculators />
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Try Our <span className="text-gradient">Personal Income Tax</span> Calculator
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant, accurate calculations based on current FIRS rates and regulations.
            </p>
          </div>
          <PersonalIncomeTaxCalculator />
        </div>
      </div>
      
      <div id="tax-history" className="py-20 bg-muted/20">
        <TaxHistoryTracker />
      </div>
      
      <div id="tax-calendar" className="py-20">
        <TaxCalendar />
      </div>
      
      <div id="tax-savings" className="py-20 bg-muted/20">
        <TaxSavingsCalculator />
      </div>
      
      <div id="tax-rates" className="py-20">
        <TaxRatesLookup />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
