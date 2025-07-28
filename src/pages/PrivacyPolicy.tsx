import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Database } from "lucide-react";

const PrivacyPolicy = () => {
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
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-4xl">
            How we collect, use, and protect your information when you use TaxGuru NG.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Information We Collect
              </CardTitle>
              <CardDescription>
                Types of information we may collect from you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Information You Provide</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Tax calculation inputs (income, expenses, etc.)</li>
                    <li>• Contact information if you reach out to us</li>
                    <li>• Feedback and comments you submit</li>
                    <li>• Information you provide through our contact forms</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Automatically Collected Information</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Device information (browser type, operating system)</li>
                    <li>• Usage data (pages visited, time spent)</li>
                    <li>• IP address and general location</li>
                    <li>• Cookies and similar technologies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                How We Use Your Information
              </CardTitle>
              <CardDescription>
                Purposes for which we use collected information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Service Provision</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Provide tax calculation services</li>
                    <li>• Improve our calculators and tools</li>
                    <li>• Respond to your questions and feedback</li>
                    <li>• Provide customer support</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Service Improvement</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Analyze usage patterns</li>
                    <li>• Develop new features</li>
                    <li>• Fix bugs and technical issues</li>
                    <li>• Enhance user experience</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Information Sharing and Disclosure
              </CardTitle>
              <CardDescription>
                When and how we may share your information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">We Do Not Share</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Your personal tax information</li>
                    <li>• Calculation inputs and results</li>
                    <li>• Contact information</li>
                    <li>• Any identifiable personal data</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Legal Requirements</h4>
                  <p className="text-sm text-blue-700">
                    We may disclose information if required by law, court order, or government request. 
                    We will notify you of any such requests unless prohibited by law.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Data Security
              </CardTitle>
              <CardDescription>
                How we protect your information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Security Measures</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• SSL encryption for data transmission</li>
                    <li>• Secure hosting and infrastructure</li>
                    <li>• Regular security audits</li>
                    <li>• Access controls and authentication</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Data Retention</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Calculation data is not stored permanently</li>
                    <li>• Contact information kept only as needed</li>
                    <li>• Regular data cleanup procedures</li>
                    <li>• Right to request data deletion</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
              <CardDescription>
                Your rights regarding your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Access and Control</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Request access to your data</li>
                    <li>• Request correction of inaccurate data</li>
                    <li>• Request deletion of your data</li>
                    <li>• Opt out of communications</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Contact Us</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    To exercise your rights or ask questions about this policy:
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Email: privacy@taxguru.ng</li>
                    <li>• Phone: +234 800 TAX GURU</li>
                    <li>• Address: Victoria Island, Lagos</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Updates to This Policy</CardTitle>
              <CardDescription>
                How we handle changes to our privacy policy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">Policy Changes</h4>
                <p className="text-sm text-orange-700">
                  We may update this privacy policy from time to time. We will notify you of any 
                  material changes by posting the new policy on our website and updating the 
                  "Last Updated" date. Your continued use of our services after such changes 
                  constitutes acceptance of the updated policy.
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  <strong>Last Updated:</strong> January 2024
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 