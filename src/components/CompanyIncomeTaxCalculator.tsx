import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/tax";
import { downloadTaxSummaryPdf } from "@/lib/pdf";

type CompanyClassification = "agribusiness-holiday" | "small" | "medium" | "large";
type CompanyTaxYear = "legacy" | "reform";

type CompanyTaxResult = {
  taxYear: CompanyTaxYear;
  turnover: number;
  totalAssets: number;
  assessableProfit: number;
  classification: CompanyClassification;
  corporateRate: number;
  developmentLevyRate: number;
  corporateTax: number;
  developmentLevy: number;
  totalDue: number;
  effectiveRate: number;
  notes: string[];
};

type SavedCompanyScenario = {
  id: string;
  savedAt: string;
  formData: {
    taxYear: CompanyTaxYear;
    turnover: string;
    totalAssets: string;
    assessableProfit: string;
    sector: string;
    isPartOfMne: boolean;
    agribusinessHoliday: boolean;
  };
  results: CompanyTaxResult;
};

const STORAGE_KEY = "taxguru:cit-scenarios";

const CompanyIncomeTaxCalculator = () => {
  const [formData, setFormData] = useState({
    taxYear: "reform" as CompanyTaxYear,
    turnover: "",
    totalAssets: "",
    assessableProfit: "",
    sector: "general",
    isPartOfMne: false,
    agribusinessHoliday: false
  });
  const [results, setResults] = useState<CompanyTaxResult | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<SavedCompanyScenario[]>([]);
  const { toast } = useToast();
  const storageHydratedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SavedCompanyScenario[];
        if (Array.isArray(parsed)) {
          setSavedScenarios(parsed);
        }
      } catch (error) {
        console.error("Failed to parse saved company tax scenarios", error);
      }
    }
    storageHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!storageHydratedRef.current || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedScenarios));
  }, [savedScenarios]);

  const saveScenario = (scenario: SavedCompanyScenario) => {
    setSavedScenarios((prev) => {
      const updated = [scenario, ...prev].slice(0, 5);
      return updated;
    });
  };

  const handleLoadScenario = (scenario: SavedCompanyScenario) => {
    setFormData(scenario.formData);
    setResults(scenario.results);
  };

  const generateScenarioId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `scenario-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  };

  const clearSavedScenarios = () => {
    setSavedScenarios([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const parseAmount = (value: string) => {
    const parsed = parseFloat(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const calculateCompanyTax = () => {
    const taxYear = formData.taxYear;
    const turnover = parseAmount(formData.turnover);
    const totalAssets = parseAmount(formData.totalAssets);
    const assessableProfit = parseAmount(formData.assessableProfit);

    if (turnover <= 0 || assessableProfit <= 0 || totalAssets <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid turnover, asset, and assessable profit amounts.",
        variant: "destructive"
      });
      return;
    }

    const agribusinessHolidayActive =
      taxYear === "reform" && formData.sector === "agribusiness" && formData.agribusinessHoliday;

    const smallCompanyEligibleReform =
      turnover <= 100_000_000 && totalAssets <= 250_000_000 && !formData.isPartOfMne;

    const smallCompanyEligibleLegacy = turnover <= 25_000_000;

    let classification: CompanyClassification;

    if (agribusinessHolidayActive) {
      classification = "agribusiness-holiday";
    } else if (taxYear === "reform" ? smallCompanyEligibleReform : smallCompanyEligibleLegacy) {
      classification = "small";
    } else if (
      taxYear === "reform"
        ? turnover >= 50_000_000_000 || formData.isPartOfMne
        : turnover > 100_000_000 || formData.isPartOfMne
    ) {
      classification = "large";
    } else {
      classification = "medium";
    }

    let corporateRate = 0;
    let developmentLevyRate = 0;
    const notes: string[] = [];

    if (classification === "agribusiness-holiday") {
      notes.push("Agribusinesses enjoy a 5-year tax holiday once registered under the incentive scheme.");
    } else if (classification === "small") {
      if (taxYear === "reform") {
        notes.push("Small companies (≤ ₦100m turnover and assets ≤ ₦250m) are exempt from CIT, CGT, and the development levy under the reform acts.");
      } else {
        notes.push("Legacy rules exempt companies with turnover not exceeding ₦25m from company income tax.");
      }
    } else if (taxYear === "reform") {
      corporateRate = 0.30;
      developmentLevyRate = 0.04;
      if (classification === "large") {
        notes.push("Large groups must maintain at least a 15% effective tax rate. The 30% CIT plus 4% levy typically exceeds this threshold.");
      } else {
        notes.push("Medium companies apply the 30% corporate rate alongside the unified 4% development levy.");
      }
    } else {
      corporateRate = classification === "medium" ? 0.20 : 0.30;
      developmentLevyRate = 0;
      if (classification === "medium") {
        notes.push("Legacy medium-sized companies (₦25m–₦100m turnover) paid CIT at 20% with no development levy.");
      } else {
        notes.push("Legacy large companies paid a flat 30% CIT with sector levies applied separately.");
      }
    }

    if (formData.sector === "digital" && taxYear === "reform") {
      notes.push("Digital, aviation, and shipping operators also face a 2%–4% levy on Nigerian-source revenues when profits cannot be determined.");
    }

    const corporateTax = assessableProfit * corporateRate;
    const developmentLevy = assessableProfit * developmentLevyRate;
    const totalDue = corporateTax + developmentLevy;
    const effectiveRate = assessableProfit > 0 ? (totalDue / assessableProfit) * 100 : 0;

    setResults({
      taxYear,
      turnover,
      totalAssets,
      assessableProfit,
      classification,
      corporateRate: corporateRate * 100,
      developmentLevyRate: developmentLevyRate * 100,
      corporateTax,
      developmentLevy,
      totalDue,
      effectiveRate,
      notes
    });

    saveScenario({
      id: generateScenarioId(),
      savedAt: new Date().toISOString(),
      formData: { ...formData },
      results: {
        taxYear,
        turnover,
        totalAssets,
        assessableProfit,
        classification,
        corporateRate: corporateRate * 100,
        developmentLevyRate: developmentLevyRate * 100,
        corporateTax,
        developmentLevy,
        totalDue,
        effectiveRate,
        notes: [...notes]
      }
    });

    toast({
      title: "Tax Calculated Successfully",
      description: `Total corporate tax and levies: ${formatCurrency(totalDue)}`,
    });
  };

  const handleDownloadPdf = () => {
    if (!results) return;

    const sections = [
      {
        heading: "Key Figures",
        lines: [
          `Tax regime: ${getTaxYearLabel(results.taxYear)}`,
          `Classification: ${getClassificationLabel(results.classification)}`,
          `Turnover: ${formatCurrency(results.turnover)}`,
          `Total assets: ${formatCurrency(results.totalAssets)}`,
          `Assessable profit: ${formatCurrency(results.assessableProfit)}`,
          `Corporate tax rate: ${results.corporateRate.toFixed(1)}%`,
          `Development levy rate: ${results.developmentLevyRate.toFixed(1)}%`,
          `Corporate tax: ${formatCurrency(results.corporateTax)}`,
          `Development levy: ${formatCurrency(results.developmentLevy)}`,
          `Total payable: ${formatCurrency(results.totalDue)}`,
          `Effective tax rate: ${results.effectiveRate.toFixed(2)}%`
        ]
      }
    ];

    if (results.notes.length > 0) {
      sections.push({ heading: "Notes", lines: results.notes });
    }

    downloadTaxSummaryPdf({
      title: "Company Income Tax Summary",
      subtitle: results.taxYear === "reform" ? "2025 Tax Reform Acts computation" : "Legacy (≤2025) computation",
      sections,
      filename: results.taxYear === "reform" ? "company-tax-summary-2026.pdf" : "company-tax-summary-legacy.pdf"
    });
  };

  const getSectorDescription = (sector: string) => {
    switch (sector) {
      case "agribusiness": return "Registered agribusiness entities";
      case "manufacturing": return "Manufacturing companies";
      case "solid-minerals": return "Solid minerals exploration";
      case "digital": return "Digital and platform service providers";
      case "general": return "General business companies";
      default: return "";
    }
  };

  const getClassificationLabel = (classification: CompanyClassification) => {
    switch (classification) {
      case "agribusiness-holiday":
        return "Agribusiness Holiday";
      case "small":
        return "Small Company";
      case "medium":
        return "Medium Company";
      case "large":
        return "Large Group";
      default:
        return "";
    }
  };

  const getTaxYearLabel = (taxYear: CompanyTaxYear) =>
    taxYear === "reform"
      ? "2026 onwards (Reform Acts)"
      : "2025 and earlier (Legacy)";

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
            Toggle between the 2026+ reform rules and legacy rates, including the unified 4% development levy, ETR guardrails, and small-company exemptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tax Regime</Label>
                <Select
                  value={formData.taxYear}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      taxYear: value as CompanyTaxYear,
                      agribusinessHoliday: value === "reform" ? prev.agribusinessHoliday : false
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reform">2026 onwards (Reform Acts)</SelectItem>
                    <SelectItem value="legacy">2025 and earlier (Legacy)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="turnover">Annual Turnover (₦)</Label>
                <Input
                  id="turnover"
                  type="number"
                  placeholder="e.g., 50000000"
                  value={formData.turnover}
                  onChange={(e) => setFormData((prev) => ({ ...prev, turnover: e.target.value }))}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assets">Total Assets (₦)</Label>
                <Input
                  id="assets"
                  type="number"
                  placeholder="e.g., 120000000"
                  value={formData.totalAssets}
                  onChange={(e) => setFormData((prev) => ({ ...prev, totalAssets: e.target.value }))}
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.taxYear === "reform"
                    ? "Assets must be ≤ ₦250m for the reform-era small-company exemption."
                    : "Legacy small-company relief applied to turnover up to ₦25m regardless of asset size."}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profit">Assessable Profit (₦)</Label>
                <Input
                  id="profit"
                  type="number"
                  placeholder="e.g., 10000000"
                  value={formData.assessableProfit}
                  onChange={(e) => setFormData((prev) => ({ ...prev, assessableProfit: e.target.value }))}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Business Sector</Label>
                <Select
                  value={formData.sector}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      sector: value,
                      agribusinessHoliday: value === "agribusiness" ? prev.agribusinessHoliday : false
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Business</SelectItem>
                    <SelectItem value="agribusiness">Agribusiness</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="solid-minerals">Solid Minerals</SelectItem>
                    <SelectItem value="digital">Digital Services & Platforms</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {getSectorDescription(formData.sector)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded border p-3">
                  <div>
                    <p className="text-sm font-medium">Part of large multinational group?</p>
                    <p className="text-xs text-muted-foreground">Applies where global revenue ≥ €750m or turnover ≥ ₦50bn.</p>
                  </div>
                  <Switch
                    checked={formData.isPartOfMne}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPartOfMne: checked }))}
                  />
                </div>

                {formData.sector === "agribusiness" && formData.taxYear === "reform" && (
                  <div className="flex items-center justify-between rounded border p-3">
                    <div>
                      <p className="text-sm font-medium">Within 5-year agribusiness holiday?</p>
                      <p className="text-xs text-muted-foreground">Holiday grants 0% CIT, CGT, and levy for qualifying entities.</p>
                    </div>
                    <Switch
                      checked={formData.agribusinessHoliday}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agribusinessHoliday: checked }))}
                    />
                  </div>
                )}
              </div>

              <Button 
                type="button"
                onClick={calculateCompanyTax}
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground text-lg py-6"
              >
                Calculate Tax
              </Button>
            </div>

            {/* Tax Rates Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">
                  {formData.taxYear === "reform" ? "2026 Reform Highlights" : "Legacy (≤2025) Quick Facts"}
                </h3>
                <div className="space-y-3">
                {formData.taxYear === "reform" ? (
                  <>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Small Companies</span>
                        <span className="text-green-600 font-bold">0%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Turnover ≤ ₦100m and assets ≤ ₦250m (no CIT, CGT, or levy).</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Medium Companies</span>
                        <span className="text-yellow-600 font-bold">30% + 4%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Standard 30% CIT with the unified 4% development levy on assessable profit.</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Large Groups</span>
                        <span className="text-red-600 font-bold">15% ETR min</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Turnover ≥ ₦50bn or part of €750m+ MNE — meet the 15% effective tax rate or face top-up taxation.</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Agribusiness Holiday</span>
                        <span className="text-green-600 font-bold">0% (5 yrs)</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Registered agribusinesses enjoy a 5-year exemption from CIT, CGT, and the development levy.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Small Companies</span>
                        <span className="text-green-600 font-bold">0%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Turnover ≤ ₦25m were exempt from CIT under the legacy regime.</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Medium Companies</span>
                        <span className="text-yellow-600 font-bold">20%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Legacy rate for ₦25m - ₦100m turnover companies (no development levy applied).</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Large Companies</span>
                        <span className="text-red-600 font-bold">30%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Turnover above ₦100m subject to 30% CIT before the reforms.</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Sector Levies</span>
                        <span className="text-green-600 font-bold">Multiple agencies</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Before 2026, levies such as TET, NASENI, IT and PTF were administered separately.</p>
                    </div>
                  </>
                )}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Quick Reference</h4>
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm">
                    <p className="font-medium text-primary">Large Group Guardrail</p>
                    <p className="text-muted-foreground">Monitor consolidated ETR monthly; trigger top-up if below 15% to avoid additional assessments.</p>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
                    <p className="font-medium text-emerald-700">Small Company Checklist</p>
                    <p className="text-muted-foreground">Confirm turnover thresholds, asset test, and independence from MNE groups before applying reform-era exemptions.</p>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm">
                    <p className="font-medium text-orange-700">Sector Actions</p>
                    <p className="text-muted-foreground">Digital/transport operators should collect monthly Nigerian-source revenue logs for the 2%–4% deemed levy filings.</p>
                  </div>
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
                <div className="flex items-center gap-3 flex-wrap">
                  <CardTitle className="text-xl text-green-800">Tax Calculation Results</CardTitle>
                  <Badge variant="outline" className="text-sm">
                    {getClassificationLabel(results.classification)}
                  </Badge>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {results.taxYear === "reform" ? "Reform Acts" : "Legacy"}
                  </Badge>
                </div>
                <CardDescription>
                  {results.classification === "agribusiness-holiday"
                    ? "Agribusiness holiday applied — incentives reduce tax to zero under the reform acts."
                    : results.classification === "small"
                      ? (results.taxYear === "reform"
                        ? "Small company exemption applied — no corporate tax or development levy due."
                        : "Legacy small company status — no CIT payable at turnover ≤ ₦25m.")
                      : results.taxYear === "reform"
                        ? "30% corporate rate plus the unified 4% development levy apply."
                        : results.classification === "medium"
                          ? "Legacy medium company rate of 20% applied with no unified levy."
                          : "Legacy large company rate of 30% applied (sector levies handled separately)."}
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
                <div className="text-2xl font-bold text-primary">{formatCurrency(results.corporateTax)}</div>
                <div className="text-sm text-muted-foreground">Corporate Income Tax</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-amber-600">{formatCurrency(results.developmentLevy)}</div>
                <div className="text-sm text-muted-foreground">
                  {results.developmentLevyRate > 0
                    ? "Development Levy (4%)"
                    : results.taxYear === "legacy"
                      ? "Legacy Sector Levies"
                      : "Development Levy"}
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(results.totalDue)}</div>
                <div className="text-sm text-muted-foreground">Total Payable</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>Turnover:</span>
                  <span className="font-semibold">{formatCurrency(results.turnover)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>Total Assets:</span>
                  <span className="font-semibold">{formatCurrency(results.totalAssets)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>Assessable Profit:</span>
                  <span className="font-semibold">{formatCurrency(results.assessableProfit)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>CIT Rate:</span>
                  <span className="font-semibold">{results.corporateRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>Development Levy:</span>
                  <span className="font-semibold">{results.developmentLevyRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>Effective Tax Rate:</span>
                  <span className="font-semibold">{results.effectiveRate.toFixed(2)}%</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Compliance Notes</h4>
                <div className="space-y-2">
                  {results.notes.map((note, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg border text-sm text-muted-foreground">
                      {note}
                    </div>
                  ))}
                  {results.notes.length === 0 && (
                    <div className="p-3 bg-white rounded-lg border text-sm text-muted-foreground">
                      Ensure prompt filing and payment to avoid penalties under the Nigeria Revenue Service Act.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {savedScenarios.length > 0 && (
        <Card className="border border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Saved Scenarios</CardTitle>
            <CardDescription>Reload recent computations to compare regimes side by side.</CardDescription>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="ghost" onClick={clearSavedScenarios}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {savedScenarios.map((scenario) => (
              <div key={scenario.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-lg border bg-background/80 p-3">
                <div>
                  <p className="font-medium text-sm">
                    {getClassificationLabel(scenario.results.classification)} · {getTaxYearLabel(scenario.results.taxYear)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Saved {new Date(scenario.savedAt).toLocaleString()} — Payable {formatCurrency(scenario.results.totalDue)}
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

export default CompanyIncomeTaxCalculator; 
