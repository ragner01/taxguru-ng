import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calculator, AlertTriangle, CheckCircle, Info } from "lucide-react";

const TaxGuide = () => {
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
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold">Nigerian Tax Guide</h1>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-4xl">
            Comprehensive guide to understanding and calculating Nigerian taxes. 
            Learn the basics, advanced concepts, and best practices for tax compliance.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Understanding Nigerian Taxes
                </CardTitle>
                <CardDescription>
                  Essential concepts and principles of Nigerian taxation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                  The 2025 Tax Reform Acts introduce a ₦800,000 personal tax-free threshold, a unified 4% development levy, and mandatory e-invoicing from 1 January 2026. The guides below highlight the key changes to help you stay compliant.
                </div>
                <div className="prose prose-sm max-w-none">
                  <h3>What is Taxation?</h3>
                  <p>
                    Taxation is the process by which the government collects money from individuals and businesses 
                    to fund public services and infrastructure. In Nigeria, the Federal Inland Revenue Service (FIRS) 
                    is responsible for collecting federal taxes.
                  </p>
                  
                  <h3>Types of Nigerian Taxes</h3>
                  <div className="grid gap-4 mt-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Direct Taxes</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Personal Income Tax (PIT)</li>
                        <li>• Company Income Tax (CIT)</li>
                        <li>• Capital Gains Tax (CGT)</li>
                        <li>• Petroleum Profit Tax (PPT)</li>
                        <li>• Development Levy (4% on assessable profits)</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Indirect Taxes</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Value Added Tax (VAT)</li>
                        <li>• Customs and Excise Duties</li>
                        <li>• Stamp Duties</li>
                        <li>• Withholding Tax (WHT)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tax Calculation Basics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Tax Calculation Fundamentals
                </CardTitle>
                <CardDescription>
                  Step-by-step guide to calculating different types of taxes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Personal Income Tax Calculation</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>1. Capture global income (salary, allowances, freelance, crypto, rent-free benefits).</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>2. Deduct pension and NHF contributions, then claim rent relief (20% of rent capped at ₦500k).</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>3. Apply the 0%–25% PIT bands (first ₦800k is tax-free).</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>4. Offset withholding tax credits to arrive at the net payable or refund.</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">VAT Calculation</h4>
                    <div className="space-y-2 text-sm text-green-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>1. Calculate Output VAT (VAT on sales)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>2. Calculate Input VAT (VAT on purchases)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>3. VAT Payable = Output VAT - Input VAT</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Company Income Tax</h4>
                    <div className="space-y-2 text-sm text-purple-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>1. Calculate Gross Profit (Revenue - Cost of Sales)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>2. Subtract allowable expenses and capital allowances.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>3. Apply the rate for your band (small firms exempt; medium 30%; large groups must meet a 15% minimum effective rate).</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>4. Add the 4% development levy (replaces TET/NASENI/PTF/IT) unless exempt.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Mistakes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Common Tax Mistakes to Avoid
                </CardTitle>
                <CardDescription>
                  Learn from common errors and ensure compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-red-800">Late Filing</h4>
                      <p className="text-sm text-red-700">Always file returns before the deadline to avoid penalties</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-red-800">Incorrect Deductions</h4>
                      <p className="text-sm text-red-700">Only claim deductions that are legally allowable</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-red-800">Poor Record Keeping</h4>
                      <p className="text-sm text-red-700">Maintain detailed records of all income and expenses</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-red-800">Ignoring Digital Requirements</h4>
                      <p className="text-sm text-red-700">Use e-filing and digital invoicing as required</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/tax-education'}
                >
                  Tax Education
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/'}
                >
                  Tax Calculators
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/firs-regulations'}
                >
                  FIRS Regulations
                </Button>
              </CardContent>
            </Card>

            {/* Tax Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tax Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 text-sm">Plan Ahead</h4>
                  <p className="text-xs text-green-700 mt-1">Start tax planning early in the year</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 text-sm">Keep Records</h4>
                  <p className="text-xs text-blue-700 mt-1">Maintain detailed financial records</p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-800 text-sm">Use E-Filing</h4>
                  <p className="text-xs text-purple-700 mt-1">File returns electronically for convenience</p>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-800 text-sm">Seek Help</h4>
                  <p className="text-xs text-orange-700 mt-1">Consult professionals for complex situations</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxGuide; 
