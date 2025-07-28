import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PersonalIncomeTaxCalculator = () => {
  const [formData, setFormData] = useState({
    annualIncome: "",
    consolidatedReliefAllowance: "200000",
    state: "lagos"
  });
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  // Nigerian Personal Income Tax rates for 2024
  const taxBrackets = [
    { min: 0, max: 300000, rate: 0.07 },
    { min: 300001, max: 600000, rate: 0.11 },
    { min: 600001, max: 1100000, rate: 0.15 },
    { min: 1100001, max: 1600000, rate: 0.19 },
    { min: 1600001, max: 3200000, rate: 0.21 },
    { min: 3200001, max: Infinity, rate: 0.24 }
  ];

  const calculateTax = () => {
    console.log("calculateTax function called");
    console.log("formData:", formData);
    
    const income = parseFloat(formData.annualIncome);
    const reliefAllowance = parseFloat(formData.consolidatedReliefAllowance);

    console.log("Parsed values:", { income, reliefAllowance });

    if (!income || income <= 0) {
      console.log("Invalid income detected");
      toast({
        title: "Invalid Input",
        description: "Please enter a valid annual income amount.",
        variant: "destructive"
      });
      return;
    }

    // Calculate taxable income
    const taxableIncome = Math.max(0, income - reliefAllowance);
    
    let totalTax = 0;
    let breakdown = [];

    for (const bracket of taxBrackets) {
      if (taxableIncome > bracket.min) {
        const taxableAtThisBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
        const taxAtThisBracket = taxableAtThisBracket * bracket.rate;
        totalTax += taxAtThisBracket;
        
        if (taxableAtThisBracket > 0) {
          breakdown.push({
            range: `₦${bracket.min.toLocaleString()} - ${bracket.max === Infinity ? 'Above' : `₦${bracket.max.toLocaleString()}`}`,
            rate: `${(bracket.rate * 100).toFixed(0)}%`,
            taxableAmount: taxableAtThisBracket,
            tax: taxAtThisBracket
          });
        }

        if (taxableIncome <= bracket.max) break;
      }
    }

    const netIncome = income - totalTax;
    const effectiveRate = (totalTax / income) * 100;

    setResults({
      grossIncome: income,
      reliefAllowance,
      taxableIncome,
      totalTax,
      netIncome,
      effectiveRate,
      breakdown
    });

    toast({
      title: "Tax Calculated Successfully",
      description: `Your total tax liability is ₦${totalTax.toLocaleString()}`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <Calculator className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Personal Income Tax Calculator</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Calculate your Nigerian Personal Income Tax based on current FIRS rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log("Form submitted");
              calculateTax();
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="income">Annual Gross Income (₦)</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="e.g., 2400000"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({...formData, annualIncome: e.target.value})}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      calculateTax();
                    }
                  }}
                  className="text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relief">Consolidated Relief Allowance (₦)</Label>
                <Input
                  id="relief"
                  type="number"
                  value={formData.consolidatedReliefAllowance}
                  onChange={(e) => setFormData({...formData, consolidatedReliefAllowance: e.target.value})}
                  className="text-lg"
                  required
                />
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Minimum relief allowance is ₦200,000 annually
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State of Residence</Label>
                <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lagos">Lagos</SelectItem>
                    <SelectItem value="abuja">Abuja (FCT)</SelectItem>
                    <SelectItem value="kano">Kano</SelectItem>
                    <SelectItem value="rivers">Rivers</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit"
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground text-lg py-6"
              >
                Calculate Tax
              </Button>
              
              {/* Fallback button in case form submission doesn't work */}
              <Button 
                type="button"
                onClick={() => {
                  console.log("Fallback button clicked");
                  calculateTax();
                }}
                className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground text-lg py-6"
              >
                Calculate Tax (Alternative)
              </Button>
            </form>

            {/* Tax Brackets Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">2024 Tax Brackets</h3>
              <div className="space-y-2">
                {taxBrackets.map((bracket, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                    <span className="text-sm">
                      ₦{bracket.min.toLocaleString()} - {bracket.max === Infinity ? 'Above' : `₦${bracket.max.toLocaleString()}`}
                    </span>
                    <span className="font-semibold text-primary">
                      {(bracket.rate * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card className="border-2 border-green-200 bg-green-50/50 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl text-green-800">Tax Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-primary">₦{results.totalTax.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Tax</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">₦{results.netIncome.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Net Income</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{results.effectiveRate.toFixed(2)}%</div>
                <div className="text-sm text-muted-foreground">Effective Rate</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Tax Breakdown:</h4>
              {results.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <div className="text-sm">
                    <div className="font-medium">{item.range}</div>
                    <div className="text-muted-foreground">₦{item.taxableAmount.toLocaleString()} taxable</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{item.rate}</div>
                    <div className="text-sm text-muted-foreground">₦{item.tax.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalIncomeTaxCalculator;