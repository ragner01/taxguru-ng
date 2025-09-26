import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calculator, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  NEW_PIT_BRACKETS,
  OLD_PIT_BRACKETS,
  calculateProgressiveTax,
  formatCurrency,
  buildRangeLabel
} from "@/lib/tax";
import { downloadTaxSummaryPdf } from "@/lib/pdf";

type TaxYear = "old" | "new";

type TaxCalculationResult = {
  taxYear: TaxYear;
  grossIncome: number;
  taxableIncome: number;
  mandatoryDeductions: number;
  rentRelief: number;
  craApplied: number;
  totalTax: number;
  withholdingTax: number;
  netPayable: number;
  effectiveRate: number;
  breakdown: ReturnType<typeof calculateProgressiveTax>["breakdown"];
};

const initialFormData = {
  taxYear: "old" as TaxYear,
  employmentIncome: "",
  freelanceIncome: "",
  cryptoGains: "",
  otherIncome: "",
  consolidatedReliefAllowance: "200000",
  pensionContribution: "",
  nhfContribution: "",
  annualRent: "",
  withholdingTaxCredit: "",
  state: "lagos"
};

type SavedPersonalScenario = {
  id: string;
  savedAt: string;
  formData: typeof initialFormData;
  results: TaxCalculationResult;
};

const STORAGE_KEY = "taxguru:pit-scenarios";

const parseAmount = (value: string) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const PersonalIncomeTaxCalculator = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [results, setResults] = useState<TaxCalculationResult | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<SavedPersonalScenario[]>([]);
  const { toast } = useToast();
  const storageHydratedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SavedPersonalScenario[];
        if (Array.isArray(parsed)) {
          setSavedScenarios(parsed);
          const latest = parsed[0];
          if (latest) {
            setFormData(latest.formData);
            setResults(latest.results);
          }
        }
      } catch (error) {
        console.error("Failed to parse saved PIT scenarios", error);
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
    return `pit-scenario-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  };

  const saveScenario = (scenario: SavedPersonalScenario) => {
    setSavedScenarios((prev) => [scenario, ...prev].slice(0, 5));
  };

  const handleLoadScenario = (scenario: SavedPersonalScenario) => {
    setFormData(scenario.formData);
    setResults(scenario.results);
  };

  const clearSavedScenarios = () => {
    setSavedScenarios([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleNumberChange = (field: keyof typeof formData) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSelectChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateTax = () => {
    const taxYear = formData.taxYear;
    const employmentIncome = parseAmount(formData.employmentIncome);
    const freelanceIncome = parseAmount(formData.freelanceIncome);
    const cryptoGains = parseAmount(formData.cryptoGains);
    const otherIncome = parseAmount(formData.otherIncome);
    const pensionContribution = parseAmount(formData.pensionContribution);
    const nhfContribution = parseAmount(formData.nhfContribution);
    const annualRent = parseAmount(formData.annualRent);
    const withheldTaxCredit = parseAmount(formData.withholdingTaxCredit);
    const craInput = parseAmount(formData.consolidatedReliefAllowance);

    const grossIncome = employmentIncome + freelanceIncome + otherIncome + (taxYear === "new" ? cryptoGains : 0);

    if (grossIncome <= 0) {
      toast({
        title: "Invalid Income",
        description: "Please enter at least one income amount.",
        variant: "destructive"
      });
      return;
    }

    const mandatoryDeductions = Math.min(grossIncome, Math.max(0, pensionContribution + nhfContribution));
    const incomeAfterDeductions = Math.max(0, grossIncome - mandatoryDeductions);

    let taxableIncome = 0;
    let rentRelief = 0;
    let craApplied = 0;
    let calculation;

    if (taxYear === "new") {
      rentRelief = annualRent > 0 ? Math.min(annualRent * 0.2, 500_000) : 0;
      taxableIncome = Math.max(0, incomeAfterDeductions - rentRelief);
      calculation = calculateProgressiveTax(taxableIncome, NEW_PIT_BRACKETS);
    } else {
      craApplied = Math.max(0, Math.min(craInput, incomeAfterDeductions));
      taxableIncome = Math.max(0, incomeAfterDeductions - craApplied);
      calculation = calculateProgressiveTax(taxableIncome, OLD_PIT_BRACKETS);
    }

    const totalTax = calculation.total;
    const netPayable = totalTax - withheldTaxCredit;
    const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

    const computation: TaxCalculationResult = {
      taxYear,
      grossIncome,
      taxableIncome,
      mandatoryDeductions,
      rentRelief,
      craApplied,
      totalTax,
      withholdingTax: withheldTaxCredit,
      netPayable,
      effectiveRate,
      breakdown: calculation.breakdown
    };

    setResults(computation);

    saveScenario({
      id: generateScenarioId(),
      savedAt: new Date().toISOString(),
      formData: { ...formData },
      results: computation
    });

    toast({
      title: "Tax Calculated",
      description: `Your total tax liability is ${formatCurrency(totalTax)}.`
    });
  };

  const handleDownloadPdf = () => {
    if (!results) return;

    const headline = results.taxYear === "new"
      ? "Summary under the 2026+ Nigeria Tax Act rules"
      : "Summary under legacy Personal Income Tax rules";

    const keyFigures = [
      `Gross income: ${formatCurrency(results.grossIncome)}`,
      `Pension and NHF deductions: ${formatCurrency(results.mandatoryDeductions)}`,
      results.taxYear === "new"
        ? `Rent relief applied: ${formatCurrency(results.rentRelief)}`
        : `CRA applied: ${formatCurrency(results.craApplied)}`,
      `Taxable income: ${formatCurrency(results.taxableIncome)}`,
      `Total personal income tax: ${formatCurrency(results.totalTax)}`,
      `Withholding tax credit: ${formatCurrency(results.withholdingTax)}`,
      `${results.netPayable >= 0 ? "Net tax payable" : "Refund due"}: ${formatCurrency(Math.abs(results.netPayable))}`,
      `Effective tax rate: ${results.effectiveRate.toFixed(2)}%`
    ];

    const breakdownLines = results.breakdown.map((item) =>
      `${item.range} at ${item.rate} — taxable ${formatCurrency(item.taxableAmount)}, tax ${formatCurrency(item.tax)}`
    );

    downloadTaxSummaryPdf({
      title: "Personal Income Tax Summary",
      subtitle: headline,
      sections: [
        { heading: "Key Figures", lines: keyFigures },
        { heading: "Band Breakdown", lines: breakdownLines }
      ],
      filename: results.taxYear === "new" ? "pit-summary-2026.pdf" : "pit-summary-legacy.pdf"
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <Calculator className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Personal Income Tax Calculator</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Updated for the 2025 Tax Reform Acts and legacy rules for earlier years
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              calculateTax();
            }}
          >
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Tax Year</Label>
                <Select value={formData.taxYear} onValueChange={handleSelectChange("taxYear")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="old">2025 and earlier</SelectItem>
                    <SelectItem value="new">2026 onwards</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" />
                  Choose the rules that match your filing year.
                </p>
              </div>

              <div className="space-y-2">
                <Label>State of Residence</Label>
                <Select value={formData.state} onValueChange={handleSelectChange("state")}>
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
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Income</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter all taxable income sources. Crypto gains are included for 2026 onwards.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="employmentIncome">Employment Income (₦)</Label>
                    <Input
                      id="employmentIncome"
                      type="number"
                      inputMode="decimal"
                      placeholder="e.g., 3,600,000"
                      value={formData.employmentIncome}
                      onChange={handleNumberChange("employmentIncome")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="freelanceIncome">Freelance / Business (₦)</Label>
                    <Input
                      id="freelanceIncome"
                      type="number"
                      inputMode="decimal"
                      placeholder="e.g., 1,200,000"
                      value={formData.freelanceIncome}
                      onChange={handleNumberChange("freelanceIncome")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cryptoGains">Crypto & Digital Gains (₦)</Label>
                    <Input
                      id="cryptoGains"
                      type="number"
                      inputMode="decimal"
                      placeholder="e.g., 500,000"
                      value={formData.cryptoGains}
                      onChange={handleNumberChange("cryptoGains")}
                    />
                    {formData.taxYear === "old" && (
                      <p className="text-xs text-muted-foreground">
                        Crypto remains outside PIT for 2025 and earlier.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherIncome">Other Taxable Income (₦)</Label>
                    <Input
                      id="otherIncome"
                      type="number"
                      inputMode="decimal"
                      placeholder="e.g., 300,000"
                      value={formData.otherIncome}
                      onChange={handleNumberChange("otherIncome")}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Deductions & Credits</h3>
                  <p className="text-sm text-muted-foreground">
                    Pension and NHF are removed before reliefs. Withholding tax credits reduce the final amount due.
                  </p>
                </div>
                <div className="space-y-3">
                  {formData.taxYear === "old" && (
                    <div className="space-y-2">
                      <Label htmlFor="cra">Consolidated Relief Allowance (₦)</Label>
                      <Input
                        id="cra"
                        type="number"
                        inputMode="decimal"
                        value={formData.consolidatedReliefAllowance}
                        onChange={handleNumberChange("consolidatedReliefAllowance")}
                      />
                      <p className="text-xs text-muted-foreground">
                        Minimum CRA is ₦200,000 under the legacy rules.
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="pensionContribution">Pension Contributions (₦)</Label>
                    <Input
                      id="pensionContribution"
                      type="number"
                      inputMode="decimal"
                      value={formData.pensionContribution}
                      onChange={handleNumberChange("pensionContribution")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nhfContribution">National Housing Fund (₦)</Label>
                    <Input
                      id="nhfContribution"
                      type="number"
                      inputMode="decimal"
                      value={formData.nhfContribution}
                      onChange={handleNumberChange("nhfContribution")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualRent">Annual Rent Paid (₦)</Label>
                    <Input
                      id="annualRent"
                      type="number"
                      inputMode="decimal"
                      placeholder="Used for 2026+ rent relief"
                      value={formData.annualRent}
                      onChange={handleNumberChange("annualRent")}
                    />
                    {formData.taxYear === "new" ? (
                      <p className="text-xs text-muted-foreground">
                        Relief equals 20% of rent capped at ₦500,000.
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Rent relief applies from 2026 filings onward.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="withholdingTax">Withholding Tax Credits (₦)</Label>
                    <Input
                      id="withholdingTax"
                      type="number"
                      inputMode="decimal"
                      placeholder="Total WHT already paid"
                      value={formData.withholdingTaxCredit}
                      onChange={handleNumberChange("withholdingTaxCredit")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-glow text-primary-foreground text-lg py-6"
            >
              Calculate Tax
            </Button>
          </form>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{formData.taxYear === "new" ? "2026+ PIT Bands" : "Legacy PIT Bands"}</h3>
              <div className="space-y-2">
                {(formData.taxYear === "new" ? NEW_PIT_BRACKETS : OLD_PIT_BRACKETS).map((bracket, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                    <span className="text-sm">{buildRangeLabel(bracket)}</span>
                    <span className="font-semibold text-primary">{(bracket.rate * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-muted/40 space-y-2 text-sm text-muted-foreground">
              <h4 className="font-semibold text-foreground">2025 Tax Reform Acts Highlights</h4>
              <p>₦800,000 tax-free threshold now applies to all residents from 2026.</p>
              <p>Crypto gains and rent relief are processed through personal income tax bands.</p>
              <p>Withholding tax credits directly offset the computed liability.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card className="border-2 border-green-200 bg-green-50/50 animate-fade-in">
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="text-xl text-green-800">Tax Calculation Results</CardTitle>
                <CardDescription>
                  {results.taxYear === "new"
                    ? "Using the 2026+ rules under the Nigeria Tax Act"
                    : "Using the legacy Personal Income Tax rules"}
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleDownloadPdf}
                className="md:mt-1"
              >
                Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-primary">{formatCurrency(results.totalTax)}</div>
                <div className="text-sm text-muted-foreground">Total PIT</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(results.withholdingTax)}</div>
                <div className="text-sm text-muted-foreground">WHT Credit</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className={`text-2xl font-bold ${results.netPayable >= 0 ? "text-red-600" : "text-green-600"}`}>
                  {formatCurrency(Math.abs(results.netPayable))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {results.netPayable >= 0 ? "Net Tax Payable" : "Refund Due"}
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{results.effectiveRate.toFixed(2)}%</div>
                <div className="text-sm text-muted-foreground">Effective Rate</div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold">Computation Snapshot</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span>Gross Income:</span>
                    <span className="font-semibold">{formatCurrency(results.grossIncome)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span>Pension &amp; NHF:</span>
                    <span className="font-semibold">{formatCurrency(results.mandatoryDeductions)}</span>
                  </div>
                  {results.taxYear === "new" && (
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                      <span>Rent Relief:</span>
                      <span className="font-semibold">{formatCurrency(results.rentRelief)}</span>
                    </div>
                  )}
                  {results.taxYear === "old" && (
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                      <span>CRA Applied:</span>
                      <span className="font-semibold">{formatCurrency(results.craApplied)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span>Taxable Income:</span>
                    <span className="font-semibold">{formatCurrency(results.taxableIncome)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Band Breakdown</h4>
                <div className="space-y-2">
                  {results.breakdown.map((item, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg border text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.range}</span>
                        <span>{item.rate}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground mt-1">
                        <span>Taxable:</span>
                        <span>{formatCurrency(item.taxableAmount)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tax:</span>
                        <span>{formatCurrency(item.tax)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {savedScenarios.length > 0 && (
        <Card className="border border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Saved Personal Tax Runs</CardTitle>
            <CardDescription>Reload a previous computation to tweak assumptions instantly.</CardDescription>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={clearSavedScenarios}
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {savedScenarios.map((scenario) => (
              <div key={scenario.id} className="flex flex-col gap-2 rounded-lg border bg-background/80 p-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-sm capitalize">{scenario.results.taxYear === "new" ? "2026+" : "Legacy"} filing</p>
                  <p className="text-xs text-muted-foreground">
                    Saved {new Date(scenario.savedAt).toLocaleString()} — Net {scenario.results.netPayable >= 0 ? "payable" : "refund"} {formatCurrency(Math.abs(scenario.results.netPayable))}
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
    </div>
  );
};

export default PersonalIncomeTaxCalculator;
