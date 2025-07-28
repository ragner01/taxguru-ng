import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Calculator, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CompanyIncomeTaxCalculator = () => {
  const [formData, setFormData] = useState({
    turnover: "",
    profitBeforeTax: "",
    companyType: "large",
    sector: "general"
  });
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  const calculateCompanyTax = () => {
    const turnover = parseFloat(formData.turnover);
    const profitBeforeTax = parseFloat(formData.profitBeforeTax);

    if (!turnover || turnover <= 0 || !profitBeforeTax || profitBeforeTax <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid turnover and profit amounts.",
        variant: "destructive"
      });
      return;
    }

    let taxRate = 0.30; // Default for large companies

    // Determine tax rate based on company type and sector
    if (formData.companyType === "small") {
      taxRate = 0; // Small companies (turnover < ₦25M) are exempt
    } else if (formData.companyType === "medium") {
      taxRate = 0.20; // Medium companies (₦25M - ₦100M)
    } else if (formData.sector === "agricultural") {
      taxRate = 0.15; // Agricultural companies
    } else if (formData.sector === "manufacturing") {
      taxRate = 0.20; // Manufacturing companies
    } else if (formData.sector === "solid-minerals") {
      taxRate = 0.20; // Solid minerals companies
    }

    const taxAmount = profitBeforeTax * taxRate;
    const netProfit = profitBeforeTax - taxAmount;
    const effectiveRate = (taxAmount / profitBeforeTax) * 100;

    setResults({
      turnover,
      profitBeforeTax,
      taxRate: taxRate * 100,
      taxAmount,
      netProfit,
      effectiveRate
    });

    toast({
      title: "Tax Calculated Successfully",
      description: `Company tax liability: ₦${taxAmount.toLocaleString()}`,
    });
  };

  const getCompanyTypeDescription = (type: string) => {
    switch (type) {
      case "small": return "Turnover below ₦25 million";
      case "medium": return "Turnover ₦25-100 million";
      case "large": return "Turnover above ₦100 million";
      default: return "";
    }
  };

  const getSectorDescription = (sector: string) => {
    switch (sector) {
      case "agricultural": return "Agricultural production companies";
      case "manufacturing": return "Manufacturing companies";
      case "solid-minerals": return "Solid minerals exploration";
      case "general": return "General business companies";
      default: return "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Company Income Tax Calculator</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Calculate corporate income tax based on company size and sector
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="turnover">Annual Turnover (₦)</Label>
                <Input
                  id="turnover"
                  type="number"
                  placeholder="e.g., 50000000"
                  value={formData.turnover}
                  onChange={(e) => setFormData({...formData, turnover: e.target.value})}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profit">Profit Before Tax (₦)</Label>
                <Input
                  id="profit"
                  type="number"
                  placeholder="e.g., 10000000"
                  value={formData.profitBeforeTax}
                  onChange={(e) => setFormData({...formData, profitBeforeTax: e.target.value})}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyType">Company Size</Label>
                <Select value={formData.companyType} onValueChange={(value) => setFormData({...formData, companyType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small Company (Below ₦25M)</SelectItem>
                    <SelectItem value="medium">Medium Company (₦25M - ₦100M)</SelectItem>
                    <SelectItem value="large">Large Company (Above ₦100M)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {getCompanyTypeDescription(formData.companyType)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Business Sector</Label>
                <Select value={formData.sector} onValueChange={(value) => setFormData({...formData, sector: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Business</SelectItem>
                    <SelectItem value="agricultural">Agricultural</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="solid-minerals">Solid Minerals</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {getSectorDescription(formData.sector)}
                </p>
              </div>

              <Button 
                onClick={() => {
                  console.log("Company Tax Calculate button clicked");
                  calculateCompanyTax();
                }} 
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground text-lg py-6"
              >
                Start Calculating
              </Button>
            </div>

            {/* Tax Rates Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">2024 Tax Rates</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Small Companies</span>
                    <span className="text-green-600 font-bold">0%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Turnover below ₦25M</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Medium Companies</span>
                    <span className="text-yellow-600 font-bold">20%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Turnover ₦25M - ₦100M</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Large Companies</span>
                    <span className="text-red-600 font-bold">30%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Turnover above ₦100M</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Agricultural</span>
                    <span className="text-green-600 font-bold">15%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Agricultural production</p>
                </div>
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
                <div className="text-2xl font-bold text-primary">₦{results.taxAmount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Tax Liability</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">₦{results.netProfit.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Net Profit</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{results.effectiveRate.toFixed(2)}%</div>
                <div className="text-sm text-muted-foreground">Effective Rate</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Calculation Details:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>Turnover:</span>
                  <span className="font-semibold">₦{results.turnover.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>Profit Before Tax:</span>
                  <span className="font-semibold">₦{results.profitBeforeTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>Tax Rate:</span>
                  <span className="font-semibold">{results.taxRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanyIncomeTaxCalculator; 