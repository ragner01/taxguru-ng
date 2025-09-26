import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { downloadTaxSummaryPdf } from "@/lib/pdf";
import { Sprout, ShieldCheck } from "lucide-react";

type CheckerInputs = {
  registeredWithCAC: boolean;
  hasFirsTin: boolean;
  agricRevenueShare: string;
  yearsOfOperation: string;
  keepsAuditedRecords: boolean;
  employsNigerians: boolean;
};

type CheckerOutcome = {
  qualifies: boolean;
  reasons: string[];
  actions: string[];
};

const AgribusinessHolidayChecker = () => {
  const [inputs, setInputs] = useState<CheckerInputs>({
    registeredWithCAC: false,
    hasFirsTin: false,
    agricRevenueShare: "80",
    yearsOfOperation: "1",
    keepsAuditedRecords: false,
    employsNigerians: false,
  });
  const [outcome, setOutcome] = useState<CheckerOutcome | null>(null);

  const handleCheckboxChange = (field: keyof CheckerInputs) => (checked: boolean) => {
    setInputs((prev) => ({ ...prev, [field]: checked }));
  };

  const handleInputChange = (field: keyof CheckerInputs) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const evaluate = () => {
    const agricShare = Number(inputs.agricRevenueShare) || 0;
    const years = Number(inputs.yearsOfOperation) || 0;

    const missing: string[] = [];
    const nextSteps: string[] = [];

    if (!inputs.registeredWithCAC) {
      missing.push("Business must be registered with the Corporate Affairs Commission (CAC).");
    }
    if (!inputs.hasFirsTin) {
      missing.push("FIRS Tax Identification Number (TIN) is required.");
    }
    if (agricShare < 70) {
      missing.push("At least 70% of revenue must come from eligible agricultural activities.");
      nextSteps.push("Consider separating non-agricultural income streams or improving agric share before application.");
    }
    if (years > 5) {
      missing.push("Holiday applies to the first 5 years of operation only.");
    }
    if (!inputs.keepsAuditedRecords) {
      missing.push("Audited financial statements are required for annual filing.");
      nextSteps.push("Engage a licensed auditor to prepare annual financial statements covering the holiday period.");
    }
    if (!inputs.employsNigerians) {
      missing.push("Programme requires demonstrable contribution to Nigerian employment.");
      nextSteps.push("Document employment of Nigerian staff and maintain PAYE compliance records.");
    }

    const qualifies = missing.length === 0;

    if (qualifies) {
      nextSteps.push("Compile CAC incorporation documents, tax clearance, and project plan for submission to FIRS.");
      nextSteps.push("File annual status reports to retain the holiday across the 5-year window.");
    } else if (nextSteps.length === 0) {
      nextSteps.push("Address highlighted requirements before submitting the holiday application to FIRS.");
    }

    setOutcome({ qualifies, reasons: missing, actions: nextSteps });
  };

  const handleDownloadPdf = () => {
    if (!outcome) return;

    downloadTaxSummaryPdf({
      title: "Agribusiness Tax Holiday Assessment",
      subtitle: outcome.qualifies ? "Eligible for 5-year holiday" : "Eligibility gaps detected",
      sections: [
        {
          heading: "Applicant Snapshot",
          lines: [
            `CAC registered: ${inputs.registeredWithCAC ? "Yes" : "No"}`,
            `FIRS TIN: ${inputs.hasFirsTin ? "Yes" : "No"}`,
            `Agric revenue share: ${inputs.agricRevenueShare}%`,
            `Years of operation: ${inputs.yearsOfOperation}`,
            `Audited records available: ${inputs.keepsAuditedRecords ? "Yes" : "No"}`,
            `Employs Nigerians: ${inputs.employsNigerians ? "Yes" : "No"}`
          ]
        },
        outcome.reasons.length
          ? { heading: "Eligibility Gaps", lines: outcome.reasons }
          : { heading: "Eligibility Gaps", lines: ["No gaps detected — proceed with application."] },
        { heading: "Recommended Actions", lines: outcome.actions }
      ],
      filename: "agribusiness-holiday-checker.pdf"
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <Sprout className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Agribusiness Holiday Checker</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Check eligibility for the 5-year tax holiday introduced by the 2025 Tax Reform Acts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox id="cac" checked={inputs.registeredWithCAC} onCheckedChange={handleCheckboxChange("registeredWithCAC")}/>
                <div>
                  <Label htmlFor="cac">Registered with CAC</Label>
                  <p className="text-xs text-muted-foreground">Company must be incorporated or properly registered with CAC.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox id="tin" checked={inputs.hasFirsTin} onCheckedChange={handleCheckboxChange("hasFirsTin")}/>
                <div>
                  <Label htmlFor="tin">FIRS TIN Available</Label>
                  <p className="text-xs text-muted-foreground">Holiday requires an active FIRS Tax Identification Number.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenueShare">Agric Revenue Share (%)</Label>
                <Input
                  id="revenueShare"
                  type="number"
                  min={0}
                  max={100}
                  value={inputs.agricRevenueShare}
                  onChange={handleInputChange("agricRevenueShare")}
                  placeholder="e.g., 80"
                />
                <p className="text-xs text-muted-foreground">Must be at least 70% of total revenue to qualify.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">Years of Operation</Label>
                <Input
                  id="years"
                  type="number"
                  min={0}
                  value={inputs.yearsOfOperation}
                  onChange={handleInputChange("yearsOfOperation")}
                  placeholder="e.g., 2"
                />
                <p className="text-xs text-muted-foreground">Holiday covers the first five (5) years of qualified operations.</p>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox id="records" checked={inputs.keepsAuditedRecords} onCheckedChange={handleCheckboxChange("keepsAuditedRecords")}/>
                <div>
                  <Label htmlFor="records">Audited Records Maintained</Label>
                  <p className="text-xs text-muted-foreground">Annual audited statements must be filed to retain the incentive.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox id="employment" checked={inputs.employsNigerians} onCheckedChange={handleCheckboxChange("employsNigerians")}/>
                <div>
                  <Label htmlFor="employment">Employs Nigerian Staff</Label>
                  <p className="text-xs text-muted-foreground">Programme encourages local employment; document supporting PAYE records.</p>
                </div>
              </div>

              <Button type="button" onClick={evaluate} className="w-full bg-primary hover:bg-primary-glow text-primary-foreground text-lg py-6">
                Check Eligibility
              </Button>
            </div>

            <div className="space-y-4">
              <Alert>
                <AlertTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Programme Snapshot
                </AlertTitle>
                <AlertDescription className="text-sm">
                  The 2025 Tax Reform Acts grant a 5-year tax holiday (CIT, CGT, levy) to qualifying agribusinesses. Approval is subject to FIRS verification and annual compliance reports.
                </AlertDescription>
              </Alert>

              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Eligible activities include crop cultivation, livestock, aquaculture, agro-processing, and storage facilities supporting agricultural value chains.</p>
                <p>Keep PAYE, VAT, and withholding tax up to date—outstanding liabilities can void the holiday even if other criteria are met.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {outcome && (
        <Card className={`border-2 ${outcome.qualifies ? "border-green-300 bg-green-50/50" : "border-red-200 bg-red-50/30"} animate-fade-in`}>
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="text-xl">
                  {outcome.qualifies ? "Eligible for Agribusiness Holiday" : "Additional Steps Required"}
                </CardTitle>
                <CardDescription>
                  {outcome.qualifies
                    ? "All core requirements met — prepare documentation for FIRS submission."
                    : "Address the gaps below before applying for the incentive."}
                </CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={handleDownloadPdf} className="md:mt-1">
                Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Eligibility Gaps</h4>
                <div className="space-y-2 text-sm">
                  {(outcome.reasons.length ? outcome.reasons : ["None — you appear to meet all mandatory criteria."]).map((item, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${outcome.reasons.length ? "bg-white" : "bg-green-100/70"}`}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Recommended Actions</h4>
                <div className="space-y-2 text-sm">
                  {outcome.actions.map((item, index) => (
                    <div key={index} className="p-3 rounded-lg border bg-white">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Final approval is granted by FIRS. Ensure continuous compliance during the holiday period to avoid claw-backs.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgribusinessHolidayChecker;
