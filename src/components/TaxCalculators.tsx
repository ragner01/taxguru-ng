import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Calculator, Building2, Receipt, Percent, AlertTriangle, Globe, Leaf } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PersonalIncomeTaxCalculator from "./PersonalIncomeTaxCalculator";
import VATCalculator from "./VATCalculator";
import CompanyIncomeTaxCalculator from "./CompanyIncomeTaxCalculator";
import CapitalGainsTaxCalculator from "./CapitalGainsTaxCalculator";
import TaxPenaltyEstimator from "./TaxPenaltyEstimator";
import DigitalServicesLevyCalculator from "./DigitalServicesLevyCalculator";
import AgribusinessHolidayChecker from "./AgribusinessHolidayChecker";

const CALCULATORS = [
  {
    id: "personal-income",
    title: "Personal Income Tax",
    description: "Dual-mode calculator for legacy rules and the 2026+ Nigeria Tax Act bands.",
    icon: Calculator,
    color: "bg-blue-500",
    features: ["2026+ ₦800k tax-free threshold", "Rent relief & WHT offsets", "Legacy CRA still supported"]
  },
  {
    id: "vat",
    title: "Value Added Tax (VAT)",
    description: "Compute VAT with the 7.5% rate, exemptions, and input VAT credit guidance.",
    icon: Receipt,
    color: "bg-green-500",
    features: ["7.5% standard rate", "Zero-rated vs exempt items", "Input VAT credit ready"]
  },
  {
    id: "company-income",
    title: "Company Income Tax",
    description: "Calculate corporate income tax with 4% levy, exemptions, and large-group ETR checks.",
    icon: Building2,
    color: "bg-purple-500",
    features: ["Small company 0% CIT/levy", "30% CIT + 4% levy", "15% ETR guardrail for large groups"]
  },
  {
    id: "capital-gains",
    title: "Capital Gains Tax",
    description: "Legacy CGT calculator with 2026+ PIT guidance for disposals.",
    icon: Percent,
    color: "bg-red-500",
    features: ["10% CGT (≤2025)", "2026+ PIT band reminder", "Exemptions & reporting window"]
  },
  {
    id: "penalties",
    title: "Penalty Estimator",
    description: "Estimate late filing penalties, payment surcharges, and monthly interest across taxes.",
    icon: AlertTriangle,
    color: "bg-orange-500",
    features: ["PIT/CIT/VAT/WHT coverage", "10% penalty + 5% monthly interest", "PDF-ready summaries"]
  },
  {
    id: "digital-services",
    title: "Digital Services Levy",
    description: "Assess the 2%–4% levy for non-resident shipping, aviation, and platform operators.",
    icon: Globe,
    color: "bg-sky-500",
    features: ["2% on verified profits", "4% deemed-profit fallback", "Monthly filing guidance"]
  },
  {
    id: "agribusiness",
    title: "Agribusiness Holiday",
    description: "Check eligibility for the 5-year agribusiness tax holiday and generate a readiness report.",
    icon: Leaf,
    color: "bg-emerald-500",
    features: ["Holiday eligibility checks", "CIT/CGT levy exemptions", "Actionable compliance tips"]
  }
] as const;

const TaxCalculators = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);

  const validCalculatorIds = useMemo(
    () => new Set(CALCULATORS.map((calc) => calc.id)),
    []
  );

  useEffect(() => {
    const toolParam = searchParams.get("tool");

    if (toolParam && validCalculatorIds.has(toolParam)) {
      setSelectedCalculator((current) => (current === toolParam ? current : toolParam));
    } else if (!toolParam && selectedCalculator !== null) {
      setSelectedCalculator(null);
    }
  }, [searchParams, selectedCalculator, validCalculatorIds]);

  const handleCalculatorSelect = (calculatorId: string) => {
    setSelectedCalculator(calculatorId);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tool", calculatorId);
    setSearchParams(nextParams, { replace: true });
  };

  const handleClearSelection = () => {
    setSelectedCalculator(null);
    if (searchParams.has("tool")) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("tool");
      setSearchParams(nextParams, { replace: true });
    }
  };

  const renderCalculator = () => {
    switch (selectedCalculator) {
      case "personal-income":
        return <PersonalIncomeTaxCalculator />;
      case "vat":
        return <VATCalculator />;
      case "company-income":
        return <CompanyIncomeTaxCalculator />;
      case "capital-gains":
        return <CapitalGainsTaxCalculator />;
      case "penalties":
        return <TaxPenaltyEstimator />;
      case "digital-services":
        return <DigitalServicesLevyCalculator />;
      case "agribusiness":
        return <AgribusinessHolidayChecker />;
      default:
        return null;
    }
  };

  if (selectedCalculator) {
    return (
      <section id="calculators" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button 
              type="button"
              variant="outline" 
              onClick={handleClearSelection}
              className="mb-4"
            >
              ← Back to Calculators
            </Button>
          </div>
          {renderCalculator()}
        </div>
      </section>
    );
  }

  return (
    <section id="calculators" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tax <span className="text-gradient">Calculators</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our comprehensive suite of Nigerian tax calculators, 
            all compliant with current FIRS regulations and rates.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CALCULATORS.map((calc, index) => (
            <Card 
              key={calc.id} 
              className="card-hover border-2 hover:border-primary/20 group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${calc.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <calc.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {calc.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {calc.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {calc.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  type="button"
                  className="w-full bg-primary hover:bg-primary-glow text-primary-foreground"
                  onClick={() => handleCalculatorSelect(calc.id)}
                >
                  Start Calculating
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TaxCalculators;
