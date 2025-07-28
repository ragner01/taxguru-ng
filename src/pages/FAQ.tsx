import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Calculator, FileText, AlertTriangle } from "lucide-react";

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("general");

  const faqData = {
    general: [
      {
        question: "What is a Tax Identification Number (TIN)?",
        answer: "A TIN is a unique 11-digit number issued by FIRS to individuals and businesses for tax purposes. It's required for all tax transactions and filings."
      },
      {
        question: "How do I register for tax in Nigeria?",
        answer: "You can register online through the FIRS e-registration portal or visit any FIRS office. You'll need your ID, proof of address, and business registration documents if applicable."
      },
      {
        question: "What is the difference between PAYE and self-assessment?",
        answer: "PAYE (Pay As You Earn) is automatic tax deduction by employers. Self-assessment is for self-employed individuals who must calculate and pay their own taxes."
      },
      {
        question: "When are tax returns due?",
        answer: "Personal income tax returns are due by March 31st annually. VAT returns are due by the 21st of the following month. Company returns are due 6 months after year-end."
      }
    ],
    personal: [
      {
        question: "What is the Consolidated Relief Allowance?",
        answer: "The CRA is ₦200,000 annually and is automatically deducted from your income before calculating tax. It's the minimum relief allowance for all taxpayers."
      },
      {
        question: "Can I claim deductions for my children's education?",
        answer: "Currently, there are no specific deductions for children's education in Nigerian tax law. However, you can claim other allowable deductions like pension contributions."
      },
      {
        question: "What happens if I don't file my tax return?",
        answer: "Late filing attracts a penalty of ₦50,000 for individuals. You may also face additional penalties and interest on unpaid taxes."
      },
      {
        question: "How do I calculate my tax if I have multiple jobs?",
        answer: "You must combine all income sources and calculate tax on the total. Each employer will deduct PAYE, but you may need to file a return to reconcile any differences."
      }
    ],
    business: [
      {
        question: "When do I need to register for VAT?",
        answer: "You must register for VAT if your annual turnover exceeds ₦25 million. Registration is mandatory for businesses meeting this threshold."
      },
      {
        question: "What is the difference between zero-rated and exempt VAT?",
        answer: "Zero-rated items are taxable at 0% but you can claim input VAT. Exempt items are not subject to VAT and you cannot claim input VAT on related purchases."
      },
      {
        question: "How do I calculate company income tax?",
        answer: "Calculate gross profit (revenue - cost of sales), subtract allowable expenses, then apply the appropriate rate: 0% for small companies, 20% for medium, 30% for large."
      },
      {
        question: "What records must I keep for tax purposes?",
        answer: "Keep all invoices, receipts, bank statements, and financial records for at least 6 years. Digital records are now mandatory for many businesses."
      }
    ],
    compliance: [
      {
        question: "What is e-filing and is it mandatory?",
        answer: "E-filing is electronic tax return submission. It's now mandatory for all taxpayers and offers faster processing and reduced errors."
      },
      {
        question: "What are the penalties for late payment?",
        answer: "Late payment attracts a 10% penalty plus 5% monthly interest on the unpaid amount. Prompt payment is essential to avoid these charges."
      },
      {
        question: "Can FIRS audit my tax returns?",
        answer: "Yes, FIRS can audit any taxpayer's returns. They may request additional documentation and conduct field visits to verify compliance."
      },
      {
        question: "What should I do if I made an error in my return?",
        answer: "File an amended return as soon as possible. Voluntary disclosure may reduce penalties, but deliberate errors can result in criminal charges."
      }
    ]
  };

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
                <HelpCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-4xl">
            Find answers to common questions about Nigerian taxes, calculations, 
            and compliance requirements.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant={activeCategory === "general" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory("general")}
                >
                  General Questions
                </Button>
                <Button 
                  variant={activeCategory === "personal" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory("personal")}
                >
                  Personal Tax
                </Button>
                <Button 
                  variant={activeCategory === "business" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory("business")}
                >
                  Business Tax
                </Button>
                <Button 
                  variant={activeCategory === "compliance" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory("compliance")}
                >
                  Compliance
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/tax-education'}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Tax Education
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/firs-regulations'}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  FIRS Regulations
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/'}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Tax Calculators
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  {activeCategory === "general" && "General Questions"}
                  {activeCategory === "personal" && "Personal Tax Questions"}
                  {activeCategory === "business" && "Business Tax Questions"}
                  {activeCategory === "compliance" && "Compliance Questions"}
                </CardTitle>
                <CardDescription>
                  {activeCategory === "general" && "Basic questions about Nigerian taxation"}
                  {activeCategory === "personal" && "Questions about personal income tax"}
                  {activeCategory === "business" && "Questions about business and corporate taxes"}
                  {activeCategory === "compliance" && "Questions about tax compliance and filing"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqData[activeCategory as keyof typeof faqData].map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Still Have Questions?
                </CardTitle>
                <CardDescription>
                  Can't find the answer you're looking for? Get in touch with us.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Contact FIRS</h4>
                    <p className="text-sm text-blue-700">
                      For official tax advice and specific questions about your situation, 
                      contact the Federal Inland Revenue Service directly.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => window.open('https://www.firs.gov.ng/contact', '_blank')}
                    >
                      Visit FIRS Website
                    </Button>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Professional Help</h4>
                    <p className="text-sm text-green-700">
                      For complex tax matters, consider consulting a qualified tax professional 
                      or accountant for personalized advice.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 