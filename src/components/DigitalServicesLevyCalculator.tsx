import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { downloadTaxSummaryPdf } from "@/lib/pdf";
import { formatCurrency } from "@/lib/tax";
import { Globe2, Receipt, CalendarDays } from "lucide-react";

type LevyRegime = "determinable" | "indeterminate";

type DigitalLevyResult = {
  grossReceipts: number;
  levyRate: number;
  levyAmount: number;
  reportingMonths: number;
  monthlyPayment: number;
  regime: LevyRegime;
};

const DigitalServicesLevyCalculator = () => {
  const [formData, setFormData] = useState({
    grossReceipts: "",
    regime: "determinable" as LevyRegime,
    reportingMonths: "12"
  });
  const [results, setResults] = useState<DigitalLevyResult | null>(null);

  const calculateLevy = () => {
    const gross = Number(formData.grossReceipts);
    const months = Math.max(1, Number(formData.reportingMonths) || 0);

    if (!gross || gross <= 0) {
      setResults(null);
      return;
    }

    const levyRate = formData.regime === "determinable" ? 0.02 : 0.04;
    const levyAmount = gross * levyRate;
    const monthlyPayment = levyAmount / months;

    setResults({
      grossReceipts: gross,
      levyRate,
      levyAmount,
      reportingMonths: months,
      monthlyPayment,
      regime: formData.regime,
    });
  };

  const handleDownloadPdf = () => {
    if (!results) return;

    downloadTaxSummaryPdf({
      title: "Digital Services Levy Summary",
      subtitle: results.regime === "determinable" ? "2% levy (profits determinable)" : "4% levy (profits indeterminate)",
      sections: [
        {
          heading: "Key Figures",
          lines: [
            `Gross Nigerian receipts: ${formatCurrency(results.grossReceipts)}`,
            `Applicable levy rate: ${(results.levyRate * 100).toFixed(1)}%`,
            `Total levy due: ${formatCurrency(results.levyAmount)}`,
            `Reporting months: ${results.reportingMonths}`,
            `Suggested monthly payment: ${formatCurrency(results.monthlyPayment)}`
          ]
        },
        {
          heading: "Compliance Notes",
          lines: [
            "Levy applies to non-resident digital, aviation, and shipping operators under the 2025 Tax Administration Act.",
            "File monthly returns within 21 days following each month end via the FIRS digital portal.",
            "Maintain transaction logs supporting gross receipts and any withholding offsets." 
          ]
        }
      ],
      filename: "digital-services-levy.pdf"
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <Globe2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Digital Services Levy Calculator</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Estimate the monthly levy for non-resident digital, aviation, and shipping operators under the 2025 reforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="grossReceipts">Gross Nigerian Receipts (₦)</Label>
                <Input
                  id="grossReceipts"
                  type="number"
                  value={formData.grossReceipts}
                  onChange={(e) => setFormData({ ...formData, grossReceipts: e.target.value })}
                  placeholder="e.g., 150000000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="regime">Profit Determination</Label>
                <Select value={formData.regime} onValueChange={(value) => setFormData({ ...formData, regime: value as LevyRegime })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="determinable">Profits clearly determinable (2%)</SelectItem>
                    <SelectItem value="indeterminate">Profits indeterminate/estimation required (4%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportingMonths">Reporting Months</Label>
                <Input
                  id="reportingMonths"
                  type="number"
                  value={formData.reportingMonths}
                  onChange={(e) => setFormData({ ...formData, reportingMonths: e.target.value })}
                  placeholder="e.g., 12"
                />
              </div>

              <Button type="button" onClick={calculateLevy} className="w-full bg-primary hover:bg-primary-glow text-primary-foreground text-lg py-6">
                Calculate Levy
              </Button>
            </div>

            <div className="space-y-4">
              <Alert>
                <AlertTitle className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" /> Gross Receipts Basis
                </AlertTitle>
                <AlertDescription className="text-sm">
                  The levy applies to gross receipts from Nigerian users. Where profits are indeterminate, FIRS applies a flat 4% charge on gross Nigerian earnings. Maintain auditable digital transaction logs to support calculations.
                </AlertDescription>
              </Alert>

              <Alert variant="default">
                <AlertTitle className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" /> Filing Reminder
                </AlertTitle>
                <AlertDescription className="text-sm">
                  Returns are due monthly within 21 days. Payment evidence and supporting schedules should accompany filings via the TaxPro Max digital levy module.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card className="border-2 border-green-200 bg-green-50/50 animate-fade-in">
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="text-xl text-green-800">Levy Summary</CardTitle>
                <CardDescription>
                  {results.regime === "determinable" ? "2% levy on determinable profits" : "4% levy where profits are indeterminate"}
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
                <div className="text-2xl font-bold text-primary">{formatCurrency(results.grossReceipts)}</div>
                <div className="text-sm text-muted-foreground">Gross Receipts</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-amber-600">{(results.levyRate * 100).toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Levy Rate</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(results.levyAmount)}</div>
                <div className="text-sm text-muted-foreground">Total Levy</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Payment Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>Reporting Months:</span>
                  <span className="font-semibold">{results.reportingMonths}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>Suggested Monthly Remittance:</span>
                  <span className="font-semibold">{formatCurrency(results.monthlyPayment)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Where final taxable profits become determinable at year-end, reconcile the levy paid with actual income tax obligations to avoid double taxation.</p>
              <p>Keep evidence of exchange rate conversions and user-location analytics to support the gross receipts disclosed.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DigitalServicesLevyCalculator;
