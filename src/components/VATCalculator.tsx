import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt, Calculator, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { downloadTaxSummaryPdf } from "@/lib/pdf";
import { formatCurrency } from "@/lib/tax";

type VatTaxYear = "legacy" | "reform";

const initialFormData = {
  taxYear: "reform" as VatTaxYear,
  amount: "",
  vatType: "inclusive",
  vatRate: "7.5"
};

type SavedVatScenario = {
  id: string;
  savedAt: string;
  formData: typeof initialFormData;
  results: {
    taxYear: VatTaxYear;
    netAmount: number;
    vatAmount: number;
    grossAmount: number;
    vatRate: number;
  };
};

const STORAGE_KEY = "taxguru:vat-scenarios";

const VATCalculator = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [results, setResults] = useState<null | {
    taxYear: VatTaxYear;
    netAmount: number;
    vatAmount: number;
    grossAmount: number;
    vatRate: number;
  }>(null);
  const [savedScenarios, setSavedScenarios] = useState<SavedVatScenario[]>([]);
  const { toast } = useToast();
  const storageHydratedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SavedVatScenario[];
        if (Array.isArray(parsed)) {
          setSavedScenarios(parsed);
          const latest = parsed[0];
          if (latest) {
            setFormData(latest.formData);
            setResults(latest.results);
          }
        }
      } catch (error) {
        console.error("Failed to parse saved VAT scenarios", error);
      }
    }
    storageHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!storageHydratedRef.current || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedScenarios));
  }, [savedScenarios]);

  const generateScenarioId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `vat-scenario-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  };

  const saveScenario = (scenario: SavedVatScenario) => {
    setSavedScenarios((prev) => [scenario, ...prev].slice(0, 5));
  };

  const handleLoadScenario = (scenario: SavedVatScenario) => {
    setFormData(scenario.formData);
    setResults(scenario.results);
  };

  const clearSavedScenarios = () => {
    setSavedScenarios([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const calculateVAT = () => {
    const amount = parseFloat(formData.amount);
    const vatRate = parseFloat(formData.vatRate);

    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    let netAmount, vatAmount, grossAmount;

    if (formData.vatType === "inclusive") {
      // VAT is included in the amount
      grossAmount = amount;
      vatAmount = (amount * vatRate) / (100 + vatRate);
      netAmount = amount - vatAmount;
    } else {
      // VAT is added to the amount
      netAmount = amount;
      vatAmount = (amount * vatRate) / 100;
      grossAmount = amount + vatAmount;
    }

    const computation = {
      taxYear: formData.taxYear,
      netAmount,
      vatAmount,
      grossAmount,
      vatRate
    };

    setResults(computation);

    saveScenario({
      id: generateScenarioId(),
      savedAt: new Date().toISOString(),
      formData: { ...formData },
      results: computation
    });

    toast({
      title: "VAT Calculated Successfully",
      description: `VAT amount: ${formatCurrency(vatAmount)}`,
    });
  };

  const handleDownloadPdf = () => {
    if (!results) return;

    const calculationType = formData.vatType === "inclusive" ? "VAT Inclusive" : "VAT Exclusive";

    downloadTaxSummaryPdf({
      title: "VAT Calculation Summary",
      subtitle: `${calculationType} at ${results.vatRate}% (${results.taxYear === "reform" ? "2026 onwards" : "Legacy"})`,
      sections: [
        {
          heading: "Key Figures",
          lines: [
            `Tax regime: ${results.taxYear === "reform" ? "2026 onwards" : "2025 and earlier"}`,
            `Net amount: ${formatCurrency(results.netAmount)}`,
            `VAT amount: ${formatCurrency(results.vatAmount)}`,
            `Gross amount: ${formatCurrency(results.grossAmount)}`
          ]
        },
        {
          heading: "Notes",
          lines: [
            formData.vatType === "inclusive"
              ? "Amount entered already includes VAT." : "VAT added on top of the entered amount.",
            results.taxYear === "reform"
              ? "From 2026, input VAT on services and capital expenditure is fully creditable."
              : "Before 2026, input VAT on services/capex may only be claimed within tighter limits.",
            "Zero-rated and exempt items remain outside the 7.5% standard rate."
          ]
        }
      ],
      filename: "vat-summary.pdf"
    });
  };

  const vatExemptItems = [
    "Basic food items (rice, beans, yam, etc.)",
    "Medical services and drugs",
    "Educational services",
    "Financial services",
    "Residential rent",
    "Transportation services",
    "Agricultural products",
    "Books and educational materials"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <Receipt className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">VAT Calculator</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Updated 7.5% VAT calculator with zero-rated essentials and full input-VAT credit guidance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tax Regime</Label>
                <Select value={formData.taxYear} onValueChange={(value) => setFormData((prev) => ({ ...prev, taxYear: value as VatTaxYear }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select regime" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reform">2026 onwards (Reform Acts)</SelectItem>
                    <SelectItem value="legacy">2025 and earlier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 100000"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vatType">VAT Type</Label>
                <Select value={formData.vatType} onValueChange={(value) => setFormData({...formData, vatType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inclusive">VAT Inclusive (Amount includes VAT)</SelectItem>
                    <SelectItem value="exclusive">VAT Exclusive (Amount excludes VAT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vatRate">VAT Rate (%)</Label>
                <Select value={formData.vatRate} onValueChange={(value) => setFormData({...formData, vatRate: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7.5">7.5% (Standard Rate)</SelectItem>
                    <SelectItem value="0">0% (Zero-rated)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="button"
                onClick={calculateVAT}
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground text-lg py-6"
              >
                Start Calculating
              </Button>
            </div>

            {/* VAT Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">VAT Information</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800">Standard Rate</h4>
                  <p className="text-sm text-blue-600">7.5% on most goods and services</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800">Zero-rated Items</h4>
                  <p className="text-sm text-green-600">0% VAT on exports and basic necessities</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800">Exempt Items</h4>
                  <p className="text-sm text-gray-600">No VAT on financial services, residential rent</p>
                </div>
                {formData.taxYear === "reform" ? (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800">Input VAT Credits</h4>
                    <p className="text-sm text-purple-600">From 2026, input VAT on services and capital expenditure is fully claimable.</p>
                  </div>
                ) : (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800">Legacy Treatment</h4>
                    <p className="text-sm text-purple-600">Prior to 2026, input VAT on services/capex had stricter restrictions—confirm allowable credits before offsetting.</p>
                  </div>
                )}
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
                <CardTitle className="text-xl text-green-800">VAT Calculation Results</CardTitle>
                <CardDescription>
                  {formData.vatType === "inclusive"
                    ? "Entered amount already includes VAT."
                    : "VAT added on top of the entered amount."}
                  {" "}
                  {results.taxYear === "reform"
                    ? "(2026+ rules: input VAT credits fully claimable.)"
                    : "(Legacy rules: verify input VAT credits before offsetting.)"}
                </CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={handleDownloadPdf} className="md:mt-1">
                Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-primary">{formatCurrency(results.netAmount)}</div>
                <div className="text-sm text-muted-foreground">Net Amount</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(results.vatAmount)}</div>
                <div className="text-sm text-muted-foreground">VAT Amount</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(results.grossAmount)}</div>
                <div className="text-sm text-muted-foreground">Gross Amount</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Calculation Details:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>VAT Rate:</span>
                  <span className="font-semibold">{results.vatRate}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>Calculation Type:</span>
                  <span className="font-semibold capitalize">{formData.vatType}</span>
                </div>
              </div>
            </div>
          </CardContent>
      </Card>
    )}

      {savedScenarios.length > 0 && (
        <Card className="border border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Saved VAT Scenarios</CardTitle>
            <CardDescription>Reload previous invoices to keep your VAT treatment consistent.</CardDescription>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="ghost" onClick={clearSavedScenarios}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {savedScenarios.map((scenario) => (
              <div key={scenario.id} className="flex flex-col gap-2 rounded-lg border bg-background/80 p-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-sm capitalize">
                    {scenario.results.taxYear === "reform" ? "Reform" : "Legacy"} · {scenario.formData.vatType}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Saved {new Date(scenario.savedAt).toLocaleString()} — VAT {formatCurrency(scenario.results.vatAmount)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => handleLoadScenario(scenario)}>
                    Load Scenario
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* VAT Exempt Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            VAT Exempt Items
          </CardTitle>
          <CardDescription>Common items that are exempt from VAT in Nigeria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-2">
            {vatExemptItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VATCalculator; 
