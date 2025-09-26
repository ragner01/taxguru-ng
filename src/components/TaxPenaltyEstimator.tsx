import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { downloadTaxSummaryPdf } from "@/lib/pdf";
import { formatCurrency } from "@/lib/tax";
import { Calculator, Clock } from "lucide-react";

const penaltyConfig = {
  pit: {
    label: "Personal Income Tax",
    filingPenalty: 50_000,
    monthlyIncrement: 50_000,
    paymentPenaltyRate: 0.10,
    monthlyInterestRate: 0.05,
  },
  cit: {
    label: "Company Income Tax",
    filingPenalty: 100_000,
    monthlyIncrement: 50_000,
    paymentPenaltyRate: 0.10,
    monthlyInterestRate: 0.05,
  },
  vat: {
    label: "Value Added Tax",
    filingPenalty: 50_000,
    monthlyIncrement: 25_000,
    paymentPenaltyRate: 0.10,
    monthlyInterestRate: 0.05,
  },
  wht: {
    label: "Withholding Tax",
    filingPenalty: 50_000,
    monthlyIncrement: 25_000,
    paymentPenaltyRate: 0.10,
    monthlyInterestRate: 0.05,
  }
} as const;

type TaxTypeKey = keyof typeof penaltyConfig;

type PenaltyResult = {
  taxType: TaxTypeKey;
  principal: number;
  daysLate: number;
  monthsLate: number;
  filingPenalty: number;
  paymentPenalty: number;
  interest: number;
  totalDue: number;
};

const TaxPenaltyEstimator = () => {
  const [taxType, setTaxType] = useState<TaxTypeKey>("pit");
  const [principal, setPrincipal] = useState("0");
  const [daysLate, setDaysLate] = useState("0");
  const [results, setResults] = useState<PenaltyResult | null>(null);

  const calculatePenalties = () => {
    const principalAmount = Number(principal);
    const lateDays = Number(daysLate);

    if (!principalAmount || principalAmount <= 0) {
      setResults(null);
      return;
    }

    const config = penaltyConfig[taxType];
    const monthsLate = Math.max(1, Math.ceil(Math.max(lateDays, 1) / 30));

    const filingPenalty = config.filingPenalty + config.monthlyIncrement * Math.max(0, monthsLate - 1);
    const paymentPenalty = principalAmount * config.paymentPenaltyRate;
    const interest = principalAmount * config.monthlyInterestRate * monthsLate;
    const totalDue = principalAmount + filingPenalty + paymentPenalty + interest;

    setResults({
      taxType,
      principal: principalAmount,
      daysLate: lateDays,
      monthsLate,
      filingPenalty,
      paymentPenalty,
      interest,
      totalDue,
    });
  };

  const handleDownloadPdf = () => {
    if (!results) return;

    const config = penaltyConfig[results.taxType];

    downloadTaxSummaryPdf({
      title: "Nigeria Tax Penalty Estimate",
      subtitle: `${config.label} (${results.monthsLate} month${results.monthsLate > 1 ? "s" : ""} late)` ,
      sections: [
        {
          heading: "Key Figures",
          lines: [
            `Principal tax outstanding: ${formatCurrency(results.principal)}`,
            `Days late: ${results.daysLate}`,
            `Months late (rounded): ${results.monthsLate}`,
            `Late payment penalty (10%): ${formatCurrency(results.paymentPenalty)}`,
            `Monthly interest (5%): ${formatCurrency(results.interest)}`,
            `Late filing penalty: ${formatCurrency(results.filingPenalty)}`,
            `Total outstanding (incl. penalties): ${formatCurrency(results.totalDue)}`
          ]
        },
        {
          heading: "Notes",
          lines: [
            "Estimates based on 2025 Tax Reform Acts guidance (10% payment penalty + 5% monthly interest).",
            "Late filing penalties compound monthly until the return is filed.",
            "Always verify with the latest FIRS circulars for sector-specific adjustments."
          ]
        }
      ],
      filename: "tax-penalty-estimate.pdf"
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
            <CardTitle className="text-2xl">Penalty &amp; Interest Estimator</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Estimate late filing and payment costs under the 2025 Tax Reform Acts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxType">Tax Type</Label>
                <Select value={taxType} onValueChange={(value) => setTaxType(value as TaxTypeKey)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pit">Personal Income Tax</SelectItem>
                    <SelectItem value="cit">Company Income Tax</SelectItem>
                    <SelectItem value="vat">Value Added Tax</SelectItem>
                    <SelectItem value="wht">Withholding Tax</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="principal">Outstanding Tax (₦)</Label>
                <Input
                  id="principal"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="e.g., 2500000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="daysLate">Days Late</Label>
                <Input
                  id="daysLate"
                  type="number"
                  value={daysLate}
                  onChange={(e) => setDaysLate(e.target.value)}
                  placeholder="e.g., 45"
                />
              </div>

              <Button type="button" onClick={calculatePenalties} className="w-full bg-primary hover:bg-primary-glow text-primary-foreground text-lg py-6">
                Estimate Penalties
              </Button>
            </div>

            <div className="space-y-4">
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>Reminder</AlertTitle>
                <AlertDescription className="text-sm">
                  Interest compounds monthly at 5%. Late filing penalties escalate for every additional month (or part) you remain non-compliant. Always settle Pay-As-You-Earn (PAYE) and indirect taxes before the statutory deadlines to avoid compounding charges.
                </AlertDescription>
              </Alert>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 bg-secondary/50 rounded-lg">
                  <span>Filing Penalty (base):</span>
                  <span className="font-semibold">₦50k / ₦100k depending on taxpayer</span>
                </div>
                <div className="flex justify-between p-3 bg-secondary/50 rounded-lg">
                  <span>Late Payment Penalty:</span>
                  <span className="font-semibold">10% of principal</span>
                </div>
                <div className="flex justify-between p-3 bg-secondary/50 rounded-lg">
                  <span>Monthly Interest:</span>
                  <span className="font-semibold">5% of principal</span>
                </div>
                <div className="flex justify-between p-3 bg-secondary/50 rounded-lg">
                  <span>Assessment Frequency:</span>
                  <span className="font-semibold">Monthly (or part thereof)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card className="border-2 border-green-200 bg-green-50/50 animate-fade-in">
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="text-xl text-green-800">Penalty Summary</CardTitle>
                <CardDescription>
                  {penaltyConfig[results.taxType].label} — {results.monthsLate} month{results.monthsLate > 1 ? "s" : ""} late
                </CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={handleDownloadPdf} className="md:mt-1">
                Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-primary">{formatCurrency(results.principal)}</div>
                <div className="text-sm text-muted-foreground">Tax Outstanding</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-amber-600">{formatCurrency(results.filingPenalty)}</div>
                <div className="text-sm text-muted-foreground">Late Filing Penalty</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-amber-600">{formatCurrency(results.paymentPenalty)}</div>
                <div className="text-sm text-muted-foreground">Late Payment Penalty</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-red-600">{formatCurrency(results.interest)}</div>
                <div className="text-sm text-muted-foreground">Interest (5% monthly)</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Computation Snapshot</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>Total Late Charges:</span>
                  <span className="font-semibold">{formatCurrency(results.filingPenalty + results.paymentPenalty + results.interest)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>Total Due (incl. principal):</span>
                  <span className="font-semibold text-green-700">{formatCurrency(results.totalDue)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Next Steps</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                  <Badge variant="outline">1</Badge>
                  <span>Settle outstanding tax and penalties promptly to stop further interest accrual.</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                  <Badge variant="outline">2</Badge>
                  <span>Submit the relevant return (PIT, CIT, VAT or WHT) via the FIRS TaxPro Max portal.</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                  <Badge variant="outline">3</Badge>
                  <span>Retain payment receipts and credit notes for future reconciliations.</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaxPenaltyEstimator;
