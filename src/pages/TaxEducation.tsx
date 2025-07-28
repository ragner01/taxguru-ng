import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Calculator, BookOpen, FileText, Building2, Receipt, Percent, Coins, Shield, AlertTriangle, CheckCircle } from "lucide-react";

const TaxEducation = () => {
  const [activeTab, setActiveTab] = useState("overview");

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
              <h1 className="text-3xl font-bold">Nigerian Tax Education</h1>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-4xl">
            Comprehensive guide to Nigerian tax laws, policies, and calculation methods. 
            Learn about all types of taxes, their legal basis, and how to calculate them correctly.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personal">Personal Tax</TabsTrigger>
            <TabsTrigger value="business">Business Tax</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Nigerian Tax System Overview
                </CardTitle>
                <CardDescription>
                  Understanding the legal framework and structure of Nigerian taxation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-orange-800 mb-2">Recent Tax Law Changes (2024)</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-orange-700">Key Updates:</h5>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• Finance Act 2024 implementation</li>
                        <li>• Enhanced digital tax administration</li>
                        <li>• New minimum wage tax considerations</li>
                        <li>• Stricter compliance requirements</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-orange-700">Important Deadlines:</h5>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• Mandatory e-filing for all taxpayers</li>
                        <li>• Enhanced penalty structure</li>
                        <li>• New reporting requirements</li>
                        <li>• Digital invoice requirements</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Legal Framework</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">Federal Inland Revenue Service (FIRS)</h4>
                          <p className="text-sm text-muted-foreground">
                            The primary tax authority responsible for collecting federal taxes and administering tax laws.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">Personal Income Tax Act (PITA)</h4>
                          <p className="text-sm text-muted-foreground">
                            Governs personal income taxation, including PAYE and self-assessment.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">Companies Income Tax Act (CITA)</h4>
                          <p className="text-sm text-muted-foreground">
                            Regulates corporate taxation and business income tax.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Tax Types</h3>
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <span className="font-medium">Personal Income Tax</span>
                        <Badge variant="secondary">Federal</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <span className="font-medium">Value Added Tax (VAT)</span>
                        <Badge variant="secondary">Federal</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <span className="font-medium">Company Income Tax</span>
                        <Badge variant="secondary">Federal</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <span className="font-medium">Capital Gains Tax</span>
                        <Badge variant="secondary">Federal</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <span className="font-medium">Withholding Tax</span>
                        <Badge variant="secondary">Federal</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <span className="font-medium">Stamp Duty</span>
                        <Badge variant="secondary">Federal</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Important Notice</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Tax laws and rates are subject to change. Always consult the official FIRS website 
                        or a qualified tax professional for the most current information and specific advice.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personal Tax Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Personal Income Tax Guide
                </CardTitle>
                <CardDescription>
                  Complete guide to personal income tax calculation and compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="tax-brackets">
                    <AccordionTrigger>2024 Tax Brackets & Rates</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>First ₦300,000</span>
                            <Badge variant="outline">7%</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>₦300,001 - ₦600,000</span>
                            <Badge variant="outline">11%</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>₦600,001 - ₦1,100,000</span>
                            <Badge variant="outline">15%</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>₦1,100,001 - ₦1,600,000</span>
                            <Badge variant="outline">19%</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>₦1,600,001 - ₦3,200,000</span>
                            <Badge variant="outline">21%</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>Above ₦3,200,000</span>
                            <Badge variant="outline">24%</Badge>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-green-800 mb-2">2024 Updates</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• Consolidated Relief Allowance increased to ₦200,000</li>
                            <li>• New minimum wage considerations</li>
                            <li>• Enhanced digital tax filing requirements</li>
                            <li>• Stricter compliance monitoring</li>
                          </ul>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          These are progressive rates, meaning higher income is taxed at higher rates.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="relief-allowances">
                    <AccordionTrigger>Relief Allowances & Deductions</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                            <span>Consolidated Relief Allowance</span>
                            <span className="font-semibold">₦200,000</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                            <span>Pension Contributions</span>
                            <span className="font-semibold">Up to 8% of salary</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                            <span>NHF Contributions</span>
                            <span className="font-semibold">2.5% of salary</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                            <span>Life Assurance Premium</span>
                            <span className="font-semibold">Actual amount paid</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          These deductions reduce your taxable income before applying tax rates.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="calculation-method">
                    <AccordionTrigger>How to Calculate Personal Income Tax</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                            <span>Calculate Gross Income (salary + allowances + bonuses)</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                            <span>Subtract Consolidated Relief Allowance (₦200,000)</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                            <span>Subtract other allowable deductions (pension, NHF, etc.)</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                            <span>Apply progressive tax rates to the remaining amount</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">5</div>
                            <span>Sum up all tax amounts from each bracket</span>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-800 mb-2">Example Calculation</h4>
                          <p className="text-sm text-blue-700">
                            For ₦2,000,000 annual income:<br/>
                            • Relief Allowance: ₦200,000<br/>
                            • Taxable Income: ₦1,800,000<br/>
                            • Tax: ₦300,000 × 7% + ₦300,000 × 11% + ₦500,000 × 15% + ₦500,000 × 19% + ₦200,000 × 21%<br/>
                            • Total Tax: ₦21,000 + ₦33,000 + ₦75,000 + ₦95,000 + ₦42,000 = ₦266,000
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Tax Tab */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Tax Guide
                </CardTitle>
                <CardDescription>
                  Comprehensive guide to VAT, Company Income Tax, and other business taxes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="vat-guide">
                    <AccordionTrigger>Value Added Tax (VAT)</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>Standard Rate</span>
                            <Badge variant="outline">7.5%</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>Zero-rated Items</span>
                            <Badge variant="outline">0%</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>Exempt Items</span>
                            <Badge variant="outline">No VAT</Badge>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-800 mb-2">2024 VAT Updates</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Mandatory digital invoicing for businesses</li>
                            <li>• Enhanced VAT registration requirements</li>
                            <li>• Stricter penalties for non-compliance</li>
                            <li>• New categories of exempt items</li>
                          </ul>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-semibold">Zero-rated Items (0% VAT):</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Basic food items (rice, beans, yam, etc.)</li>
                            <li>• Books and educational materials</li>
                            <li>• Baby products and medicines</li>
                            <li>• Agricultural products</li>
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold">Exempt Items (No VAT):</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Medical services and equipment</li>
                            <li>• Educational services</li>
                            <li>• Financial services</li>
                            <li>• Transportation services</li>
                          </ul>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-green-800 mb-2">VAT Calculation Method</h4>
                          <p className="text-sm text-green-700">
                            Output VAT - Input VAT = VAT Payable<br/>
                            • Output VAT: VAT charged on sales<br/>
                            • Input VAT: VAT paid on purchases<br/>
                            • If result is positive, pay to FIRS<br/>
                            • If result is negative, claim refund or carry forward
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="company-tax">
                    <AccordionTrigger>Company Income Tax</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>Small Companies (≤₦25M turnover)</span>
                            <Badge variant="outline">0%</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>Medium Companies (₦25M-₦100M)</span>
                            <Badge variant="outline">20%</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>Large Companies (&gt;₦100M)</span>
                            <Badge variant="outline">30%</Badge>
                          </div>
                        </div>
                        
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <h4 className="font-semibold text-purple-800 mb-2">2024 Corporate Tax Updates</h4>
                          <ul className="text-sm text-purple-700 space-y-1">
                            <li>• Enhanced tax incentives for SMEs</li>
                            <li>• New digital economy tax provisions</li>
                            <li>• Stricter transfer pricing regulations</li>
                            <li>• Mandatory e-filing for all companies</li>
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold">Taxable Income Calculation:</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Gross Income (sales, fees, commissions)</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Less: Allowable Expenses (cost of sales, salaries, rent, etc.)</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Less: Capital Allowances (depreciation)</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Equals: Taxable Income</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="withholding-tax">
                    <AccordionTrigger>Withholding Tax</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>Rent (Individuals)</span>
                            <Badge variant="outline">10%</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>Rent (Companies)</span>
                            <Badge variant="outline">10%</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>Professional Services</span>
                            <Badge variant="outline">5%</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>Dividends</span>
                            <Badge variant="outline">10%</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>Interest</span>
                            <Badge variant="outline">10%</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <span>Royalties</span>
                            <Badge variant="outline">10%</Badge>
                          </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h4 className="font-semibold text-yellow-800 mb-2">Important Notes</h4>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Withholding tax is deducted at source</li>
                            <li>• It's a final tax for some payments</li>
                            <li>• For others, it's a credit against final tax liability</li>
                            <li>• Must be remitted to FIRS within 30 days</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Tax Compliance Guide
                </CardTitle>
                <CardDescription>
                  Important deadlines, filing requirements, and compliance procedures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Filing Deadlines</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-secondary/50 rounded-lg">
                        <h4 className="font-medium">Personal Income Tax</h4>
                        <p className="text-sm text-muted-foreground">March 31st annually</p>
                      </div>
                      <div className="p-3 bg-secondary/50 rounded-lg">
                        <h4 className="font-medium">Company Income Tax</h4>
                        <p className="text-sm text-muted-foreground">6 months after year-end</p>
                      </div>
                      <div className="p-3 bg-secondary/50 rounded-lg">
                        <h4 className="font-medium">VAT Returns</h4>
                        <p className="text-sm text-muted-foreground">21st of following month</p>
                      </div>
                      <div className="p-3 bg-secondary/50 rounded-lg">
                        <h4 className="font-medium">Withholding Tax</h4>
                        <p className="text-sm text-muted-foreground">30 days after deduction</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Penalties & Interest</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-medium text-red-800">Late Filing</h4>
                        <p className="text-sm text-red-700">₦50,000 for individuals, ₦100,000 for companies</p>
                      </div>
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-medium text-red-800">Late Payment</h4>
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
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">Compliance Best Practices</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium">For Individuals:</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Keep detailed records of all income and expenses</li>
                        <li>• File returns before March 31st deadline</li>
                        <li>• Pay estimated taxes quarterly if self-employed</li>
                        <li>• Maintain receipts for all deductions</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">For Businesses:</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Register for VAT if turnover exceeds ₦25M</li>
                        <li>• Issue proper tax invoices</li>
                        <li>• Maintain separate accounts for VAT</li>
                        <li>• File monthly VAT returns</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="text-center py-8">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary-glow text-primary-foreground"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Start Calculating Your Taxes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaxEducation; 