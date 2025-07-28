import { useState } from "react";
import { Calculator, Building2, Receipt, FileText, Percent, Coins } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PersonalIncomeTaxCalculator from "./PersonalIncomeTaxCalculator";
import VATCalculator from "./VATCalculator";
import CompanyIncomeTaxCalculator from "./CompanyIncomeTaxCalculator";
import CapitalGainsTaxCalculator from "./CapitalGainsTaxCalculator";

const TaxCalculators = () => {
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);

  const calculators = [
    {
      id: "personal-income",
      title: "Personal Income Tax",
      description: "Calculate your annual personal income tax based on current FIRS rates and allowances.",
      icon: Calculator,
      color: "bg-blue-500",
      features: ["Annual/Monthly calculation", "Tax reliefs & allowances", "PAYE computation"]
    },
    {
      id: "vat",
      title: "Value Added Tax (VAT)",
      description: "Compute VAT for goods and services with current 7.5% rate and exemptions.",
      icon: Receipt,
      color: "bg-green-500",
      features: ["7.5% standard rate", "Exempt items check", "Input/Output VAT"]
    },
    {
      id: "company-income",
      title: "Company Income Tax",
      description: "Calculate corporate income tax for small, medium and large companies.",
      icon: Building2,
      color: "bg-purple-500",
      features: ["SME rates (20%)", "Large company (30%)", "Tax incentives"]
    },
    {
      id: "capital-gains",
      title: "Capital Gains Tax",
      description: "Calculate capital gains tax on disposal of assets and investments.",
      icon: Percent,
      color: "bg-red-500",
      features: ["10% standard rate", "Asset valuation", "Exemptions"]
    },
    {
      id: "withholding",
      title: "Withholding Tax",
      description: "Determine withholding tax rates for various transactions and services.",
      icon: FileText,
      color: "bg-orange-500",
      features: ["Service payments", "Rent & dividends", "Contract payments"]
    },
    {
      id: "stamp-duty",
      title: "Stamp Duty",
      description: "Compute stamp duty on various instruments and transactions.",
      icon: Coins,
      color: "bg-indigo-500",
      features: ["Property transactions", "Loan agreements", "Legal documents"]
    }
  ];

  const handleCalculatorSelect = (calculatorId: string) => {
    console.log("Calculator selected:", calculatorId);
    setSelectedCalculator(calculatorId);
  };

  const renderCalculator = () => {
    console.log("Rendering calculator for:", selectedCalculator);
    switch (selectedCalculator) {
      case "personal-income":
        return <PersonalIncomeTaxCalculator />;
      case "vat":
        return <VATCalculator />;
      case "company-income":
        return <CompanyIncomeTaxCalculator />;
      case "capital-gains":
        return <CapitalGainsTaxCalculator />;
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
              variant="outline" 
              onClick={() => {
                console.log("Going back to calculator list");
                setSelectedCalculator(null);
              }}
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
          {calculators.map((calc, index) => (
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