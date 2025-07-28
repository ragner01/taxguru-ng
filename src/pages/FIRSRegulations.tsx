import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";

const FIRSRegulations = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              ← Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold">FIRS Regulations</h1>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-4xl">
            Official Federal Inland Revenue Service regulations, compliance requirements, 
            and legal framework for Nigerian taxation.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Legal Framework */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Legal Framework
                </CardTitle>
                <CardDescription>
                  Primary laws and regulations governing Nigerian taxation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Personal Income Tax Act (PITA)</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Governs personal income taxation including PAYE, self-assessment, and relief allowances.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Progressive tax rates from 7% to 24%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Consolidated Relief Allowance provisions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>State and federal tax administration</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Companies Income Tax Act (CITA)</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Regulates corporate taxation, business income tax, and company compliance.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Corporate tax rates by company size</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Transfer pricing regulations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Tax incentives and exemptions</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Value Added Tax Act (VATA)</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Governs VAT administration, rates, and compliance requirements.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>7.5% standard rate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Zero-rated and exempt items</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Digital invoicing requirements</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance Requirements
                </CardTitle>
                <CardDescription>
                  Essential requirements for tax compliance and filing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Registration Requirements</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Tax Identification Number (TIN) registration</li>
                      <li>• VAT registration for businesses with ₦25M+ turnover</li>
                      <li>• Company registration with CAC</li>
                      <li>• Digital signature certificates</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Filing Requirements</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Annual personal income tax returns (March 31st)</li>
                      <li>• Monthly VAT returns (21st of following month)</li>
                      <li>• Company income tax returns (6 months after year-end)</li>
                      <li>• Withholding tax remittance (30 days)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Digital Requirements</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Mandatory e-filing for all returns</li>
                      <li>• Digital invoicing for VAT-registered businesses</li>
                      <li>• Electronic payment of taxes</li>
                      <li>• Digital record keeping</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Penalties and Enforcement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Penalties and Enforcement
                </CardTitle>
                <CardDescription>
                  Consequences of non-compliance and enforcement measures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800">Late Filing Penalties</h4>
                    <p className="text-sm text-red-700">₦50,000 for individuals, ₦100,000 for companies</p>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800">Late Payment Penalties</h4>
                    <p className="text-sm text-red-700">10% of tax due + 5% monthly interest</p>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800">False Declaration</h4>
                    <p className="text-sm text-red-700">Up to ₦200,000 fine + imprisonment</p>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800">Digital Non-Compliance</h4>
                    <p className="text-sm text-red-700">₦25,000 for failure to e-file</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Official Links */}
            <Card>
              <CardHeader>
                <CardTitle>Official FIRS Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('https://www.firs.gov.ng', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  FIRS Official Website
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('https://www.firs.gov.ng/e-services', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  E-Services Portal
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('https://www.firs.gov.ng/tax-laws', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Tax Laws & Regulations
                </Button>
              </CardContent>
            </Card>

            {/* Important Notices */}
            <Card>
              <CardHeader>
                <CardTitle>Important Notices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 text-sm">Disclaimer</h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    This information is for guidance only. Always consult official FIRS sources for current regulations.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 text-sm">Updates</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    Tax laws are subject to change. Check FIRS website for latest updates.
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 text-sm">Professional Advice</h4>
                  <p className="text-xs text-green-700 mt-1">
                    For complex tax matters, consult qualified tax professionals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FIRSRegulations; 