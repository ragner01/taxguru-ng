import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt, Calculator, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VATCalculator = () => {
  const [formData, setFormData] = useState({
    amount: "",
    vatType: "inclusive", // inclusive or exclusive
    vatRate: "7.5"
  });
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  const calculateVAT = () => {
    const amount = parseFloat(formData.amount);
    const vatRate = parseFloat(formData.vatRate);

    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    let netAmount, vatAmount, grossAmount;

    if (formData.vatType === "inclusive") {
      // VAT is included in the amount
      grossAmount = amount;
      vatAmount = (amount * vatRate) / (100 + vatRate);
      netAmount = amount - vatAmount;
    } else {
      // VAT is added to the amount
      netAmount = amount;
      vatAmount = (amount * vatRate) / 100;
      grossAmount = amount + vatAmount;
    }

    setResults({
      netAmount,
      vatAmount,
      grossAmount,
      vatRate
    });

    toast({
      title: "VAT Calculated Successfully",
      description: `VAT amount: ₦${vatAmount.toLocaleString()}`,
    });
  };

  const vatExemptItems = [
    "Basic food items (rice, beans, yam, etc.)",
    "Medical services and drugs",
    "Educational services",
    "Financial services",
    "Residential rent",
    "Transportation services",
    "Agricultural products",
    "Books and educational materials"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <Receipt className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">VAT Calculator</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Calculate Value Added Tax (VAT) at 7.5% rate for Nigerian transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 100000"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vatType">VAT Type</Label>
                <Select value={formData.vatType} onValueChange={(value) => setFormData({...formData, vatType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inclusive">VAT Inclusive (Amount includes VAT)</SelectItem>
                    <SelectItem value="exclusive">VAT Exclusive (Amount excludes VAT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vatRate">VAT Rate (%)</Label>
                <Select value={formData.vatRate} onValueChange={(value) => setFormData({...formData, vatRate: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7.5">7.5% (Standard Rate)</SelectItem>
                    <SelectItem value="0">0% (Zero-rated)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={() => {
                  console.log("VAT Calculate button clicked");
                  calculateVAT();
                }} 
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground text-lg py-6"
              >
                Start Calculating
              </Button>
            </div>

            {/* VAT Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">VAT Information</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800">Standard Rate</h4>
                  <p className="text-sm text-blue-600">7.5% on most goods and services</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800">Zero-rated Items</h4>
                  <p className="text-sm text-green-600">0% VAT on exports and basic necessities</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800">Exempt Items</h4>
                  <p className="text-sm text-gray-600">No VAT on financial services, residential rent</p>
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
            <CardTitle className="text-xl text-green-800">VAT Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-primary">₦{results.netAmount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Net Amount</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">₦{results.vatAmount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">VAT Amount</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">₦{results.grossAmount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Gross Amount</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Calculation Details:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>VAT Rate:</span>
                  <span className="font-semibold">{results.vatRate}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <span>Calculation Type:</span>
                  <span className="font-semibold capitalize">{formData.vatType}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* VAT Exempt Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            VAT Exempt Items
          </CardTitle>
          <CardDescription>Common items that are exempt from VAT in Nigeria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-2">
            {vatExemptItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VATCalculator; 