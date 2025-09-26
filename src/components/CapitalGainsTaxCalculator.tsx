import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Percent, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { downloadTaxSummaryPdf } from "@/lib/pdf";
import { formatCurrency } from "@/lib/tax";

const CapitalGainsTaxCalculator = () => {
  const [formData, setFormData] = useState({
    taxYear: "old",
    purchasePrice: "",
    salePrice: "",
    assetType: "shares",
    holdingPeriod: "short"
  });
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  const calculateCapitalGainsTax = () => {
    if (formData.taxYear === "new") {
      setResults(null);
      toast({
        title: "Use PIT Bands",
        description: "From 2026, capital gains are taxed under personal income tax bands.",
      });
      return;
    }

    const purchasePrice = parseFloat(formData.purchasePrice);
    const salePrice = parseFloat(formData.salePrice);

    if (!purchasePrice || purchasePrice <= 0 || !salePrice || salePrice <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid purchase and sale prices.",
        variant: "destructive"
      });
      return;
    }

    const capitalGain = salePrice - purchasePrice;
    
    if (capitalGain <= 0) {
      toast({
        title: "No Capital Gain",
        description: "No tax is due as there is no capital gain.",
      });
      return;
    }

    // Capital gains tax rate is 10% for all assets
    const taxRate = 0.10;
    const taxAmount = capitalGain * taxRate;
    const netProceeds = salePrice - taxAmount;
    const gainPercentage = (capitalGain / purchasePrice) * 100;

    setResults({
      purchasePrice,
      salePrice,
      capitalGain,
      taxAmount,
      netProceeds,
      gainPercentage,
      taxRate: taxRate * 100
    });

    toast({
      title: "Capital Gains Tax Calculated",
      description: `Tax liability: ${formatCurrency(taxAmount)}`,
    });
  };

  const handleDownloadPdf = () => {
    if (!results) return;

    downloadTaxSummaryPdf({
      title: "Capital Gains Tax Summary",
      subtitle: "Legacy 10% CGT rules (2025 and earlier)",
      sections: [
        {
          heading: "Key Figures",
          lines: [
            `Asset type: ${formData.assetType}`,
            `Holding period: ${formData.holdingPeriod === "short" ? "Short term" : "Long term"}`,
            `Purchase price: ${formatCurrency(results.purchasePrice)}`,
            `Sale price: ${formatCurrency(results.salePrice)}`,
            `Capital gain: ${formatCurrency(results.capitalGain)}`,
            `Tax rate: ${results.taxRate}%`,
            `Tax amount: ${formatCurrency(results.taxAmount)}`,
            `Net proceeds after tax: ${formatCurrency(results.netProceeds)}`
          ]
        },
        {
          heading: "Notes",
          lines: [
            "From January 2026, capital gains are assessed under the personal income tax bands.",
            "Report disposals within 30 days and retain supporting documentation."
          ]
        }
      ],
      filename: "capital-gains-summary.pdf"
    });
  };

  const getAssetTypeDescription = (type: string) => {
    switch (type) {
      case "shares": return "Stocks, bonds, and securities";
      case "property": return "Real estate and land";
      case "business": return "Business assets and goodwill";
      case "vehicles": return "Cars, boats, and other vehicles";
      case "other": return "Other capital assets";
      default: return "";
    }
  };

  const exemptAssets = [
    "Personal residence (principal home)",
    "Government securities",
    "Life insurance policies",
    "Personal effects and household items",
    "Agricultural land (if used for farming)",
    "Inherited assets (first transfer)"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <Percent className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Capital Gains Tax Calculator</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Updated for the 2025 reforms with guidance for 2026+ capital gains treatment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price (₦)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  placeholder="e.g., 1000000"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                  disabled={formData.taxYear === "new"}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price (₦)</Label>
                <Input
                  id="salePrice"
                  type="number"
                  placeholder="e.g., 1500000"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                  disabled={formData.taxYear === "new"}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetType">Asset Type</Label>
                <Select value={formData.assetType} onValueChange={(value) => setFormData({...formData, assetType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shares">Shares & Securities</SelectItem>
                    <SelectItem value="property">Real Estate</SelectItem>
                    <SelectItem value="business">Business Assets</SelectItem>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                    <SelectItem value="other">Other Assets</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {getAssetTypeDescription(formData.assetType)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="holdingPeriod">Holding Period</Label>
                <Select value={formData.holdingPeriod} onValueChange={(value) => setFormData({...formData, holdingPeriod: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short Term (Less than 1 year)</SelectItem>
                    <SelectItem value="long">Long Term (1 year or more)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="button"
                onClick={calculateCapitalGainsTax} 
                disabled={formData.taxYear === "new"}
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground text-lg py-6 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {formData.taxYear === "new" ? "CGT Disabled" : "Calculate Tax"}
              </Button>
            </div>

            {/* Tax Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Capital Gains Tax Info</h3>
              <div className="space-y-3">
                <div className="space-y-3">
                  <Label>Tax Year</Label>
                  <Select
                    value={formData.taxYear}
                    onValueChange={(value) => {
                      setResults(null);
                      setFormData((prev) => ({ ...prev, taxYear: value }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="old">2025 and earlier</SelectItem>
                      <SelectItem value="new">2026 onwards</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.taxYear === "new" && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertTitle>2026+ Policy Update</AlertTitle>
                    <AlertDescription>
                      From January 2026, crypto and other gains are taxed under the personal income tax bands. Please use the Personal Income Tax calculator to determine your liability.
                    </AlertDescription>
                  </Alert>
                )}
                {formData.taxYear === "old" ? (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800">Standard Rate</h4>
                    <p className="text-sm text-blue-600">10% on net capital gains under legacy rules.</p>
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800">Personal Income Tax Bands</h4>
                    <p className="text-sm text-blue-600">Apply the 0%–25% PIT bands (₦800k tax-free threshold) for 2026 filings.</p>
                  </div>
                )}
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800">Exemptions</h4>
                  <p className="text-sm text-green-600">Personal residence, government securities</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800">Reporting</h4>
                  <p className="text-sm text-yellow-600">Must be reported within 30 days of disposal</p>
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
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="text-xl text-green-800">Capital Gains Tax Results</CardTitle>
                <CardDescription>Legacy computation under the 10% CGT rules.</CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={handleDownloadPdf} className="md:mt-1">
                Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-primary">{formatCurrency(results.capitalGain)}</div>
                <div className="text-sm text-muted-foreground">Capital Gain</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(results.taxAmount)}</div>
                <div className="text-sm text-muted-foreground">Tax Liability</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{results.gainPercentage.toFixed(2)}%</div>
                <div className="text-sm text-muted-foreground">Gain Percentage</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Calculation Details:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span>Purchase Price:</span>
                    <span className="font-semibold">{formatCurrency(results.purchasePrice)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span>Sale Price:</span>
                    <span className="font-semibold">{formatCurrency(results.salePrice)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span>Tax Rate:</span>
                    <span className="font-semibold">{results.taxRate}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span>Net Proceeds:</span>
                    <span className="font-semibold">{formatCurrency(results.netProceeds)}</span>
                  </div>
                </div>
              </div>
          </CardContent>
        </Card>
      )}

      {/* Exempt Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Exempt Assets
          </CardTitle>
          <CardDescription>Assets that are exempt from capital gains tax</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-2">
            {exemptAssets.map((asset, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">{asset}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CapitalGainsTaxCalculator; 
