import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, Calculator, Percent } from 'lucide-react';

const TaxRatesLookup = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const personalIncomeTaxRates = [
    { range: '₦0 - ₦300,000', rate: '7%', annualTax: '₦0 - ₦21,000' },
    { range: '₦300,001 - ₦600,000', rate: '11%', annualTax: '₦21,001 - ₦54,000' },
    { range: '₦600,001 - ₦1,100,000', rate: '15%', annualTax: '₦54,001 - ₦129,000' },
    { range: '₦1,100,001 - ₦1,600,000', rate: '19%', annualTax: '₦129,001 - ₦224,000' },
    { range: '₦1,600,001 - ₦3,200,000', rate: '21%', annualTax: '₦224,001 - ₦560,000' },
    { range: 'Above ₦3,200,000', rate: '24%', annualTax: 'Above ₦560,000' }
  ];

  const companyIncomeTaxRates = [
    { category: 'Large Companies', rate: '30%', description: 'Companies with turnover above ₦100 million' },
    { category: 'Medium Companies', rate: '20%', description: 'Companies with turnover ₦25-100 million' },
    { category: 'Small Companies', rate: '0%', description: 'Companies with turnover below ₦25 million' },
    { category: 'Manufacturing Companies', rate: '20%', description: 'Companies in manufacturing sector' },
    { category: 'Agricultural Companies', rate: '15%', description: 'Companies in agricultural production' },
    { category: 'Solid Minerals Companies', rate: '20%', description: 'Companies in solid minerals exploration' }
  ];

  const vatRates = [
    { item: 'Standard VAT Rate', rate: '7.5%', description: 'Applied to most goods and services' },
    { item: 'Zero-rated Items', rate: '0%', description: 'Exports, basic food items, medical services' },
    { item: 'Exempt Items', rate: 'N/A', description: 'Financial services, rent on residential property' }
  ];

  const withholdingTaxRates = [
    { service: 'Dividends', rate: '10%', resident: 'Yes', nonResident: '10%' },
    { service: 'Interest', rate: '10%', resident: 'Yes', nonResident: '10%' },
    { service: 'Royalties', rate: '10%', resident: 'Yes', nonResident: '10%' },
    { service: 'Rent', rate: '10%', resident: 'Yes', nonResident: '10%' },
    { service: 'Professional Services', rate: '5%', resident: 'Yes', nonResident: '10%' },
    { service: 'Technical Services', rate: '5%', resident: 'Yes', nonResident: '10%' },
    { service: 'Management Services', rate: '5%', resident: 'Yes', nonResident: '10%' },
    { service: 'Commissions', rate: '5%', resident: 'Yes', nonResident: '10%' },
    { service: 'Directors Fees', rate: '10%', resident: 'Yes', nonResident: '10%' }
  ];

  const otherTaxes = [
    { tax: 'Capital Gains Tax', rate: '10%', description: 'On disposal of chargeable assets' },
    { tax: 'Stamp Duty', rate: '0.75%', description: 'On share transfers and other instruments' },
    { tax: 'Education Tax', rate: '2%', description: 'On assessable profits of companies' },
    { tax: 'National Housing Fund', rate: '2.5%', description: 'Employee contribution to housing fund' },
    { tax: 'NHIS Contribution', rate: '1.75%', description: 'Employee contribution to health insurance' },
    { tax: 'Pension Contribution', rate: '8%', description: 'Employee contribution to pension' },
    { tax: 'Information Technology Levy', rate: '1%', description: 'On assessable profits above ₦100 million' }
  ];

  const payeTaxRates = [
    { range: '₦0 - ₦300,000', rate: '7%', description: 'First ₦300,000 of annual income' },
    { range: '₦300,001 - ₦600,000', rate: '11%', description: 'Next ₦300,000 of annual income' },
    { range: '₦600,001 - ₦1,100,000', rate: '15%', description: 'Next ₦500,000 of annual income' },
    { range: '₦1,100,001 - ₦1,600,000', rate: '19%', description: 'Next ₦500,000 of annual income' },
    { range: '₦1,600,001 - ₦3,200,000', rate: '21%', description: 'Next ₦1,600,000 of annual income' },
    { range: 'Above ₦3,200,000', rate: '24%', description: 'Income above ₦3,200,000' }
  ];

  const filterData = (data: any[], searchTerm: string) => {
    if (!searchTerm) return data;
    return data.filter(item => 
      Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Nigerian Tax <span className="text-gradient">Rates Lookup</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Complete reference guide for all Nigerian tax rates and regulations
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tax rates, categories, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="vat">VAT</TabsTrigger>
          <TabsTrigger value="withholding">WHT</TabsTrigger>
          <TabsTrigger value="paye">PAYE</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Personal Income Tax Rates (2025)
              </CardTitle>
              <CardDescription>Progressive tax rates for individual income</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Income Range</th>
                      <th className="text-center p-3">Tax Rate</th>
                      <th className="text-right p-3">Annual Tax Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterData(personalIncomeTaxRates, searchTerm).map((rate, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{rate.range}</td>
                        <td className="text-center p-3">
                          <Badge variant="outline">{rate.rate}</Badge>
                        </td>
                        <td className="text-right p-3">{rate.annualTax}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-muted/50 rounded">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Basic relief allowance of ₦200,000 plus 20% of gross income (up to ₦200,000) is deductible.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Company Income Tax Rates
              </CardTitle>
              <CardDescription>Tax rates based on company size and sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {filterData(companyIncomeTaxRates, searchTerm).map((rate, index) => (
                  <div key={index} className="p-4 border rounded hover:bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{rate.category}</h3>
                        <p className="text-sm text-muted-foreground">{rate.description}</p>
                      </div>
                      <Badge variant="outline" className="text-lg">{rate.rate}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Value Added Tax (VAT) Rates
              </CardTitle>
              <CardDescription>VAT rates for different categories of goods and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {filterData(vatRates, searchTerm).map((rate, index) => (
                  <div key={index} className="p-4 border rounded hover:bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{rate.item}</h3>
                        <p className="text-sm text-muted-foreground">{rate.description}</p>
                      </div>
                      <Badge variant="outline" className="text-lg">{rate.rate}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withholding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withholding Tax Rates</CardTitle>
              <CardDescription>Tax rates for different types of payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Service/Payment Type</th>
                      <th className="text-center p-3">Resident Rate</th>
                      <th className="text-center p-3">Non-Resident Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterData(withholdingTaxRates, searchTerm).map((rate, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{rate.service}</td>
                        <td className="text-center p-3">
                          <Badge variant="outline">{rate.rate}</Badge>
                        </td>
                        <td className="text-center p-3">
                          <Badge variant="outline">{rate.nonResident}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paye" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pay As You Earn (PAYE) Tax Rates</CardTitle>
              <CardDescription>Progressive tax rates for employee income</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filterData(payeTaxRates, searchTerm).map((rate, index) => (
                  <div key={index} className="p-4 border rounded hover:bg-muted/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{rate.range}</h3>
                        <p className="text-sm text-muted-foreground">{rate.description}</p>
                      </div>
                      <Badge variant="outline" className="text-lg">{rate.rate}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Other Nigerian Taxes</CardTitle>
              <CardDescription>Additional taxes and levies in Nigeria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {filterData(otherTaxes, searchTerm).map((tax, index) => (
                  <div key={index} className="p-4 border rounded hover:bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{tax.tax}</h3>
                        <p className="text-sm text-muted-foreground">{tax.description}</p>
                      </div>
                      <Badge variant="outline" className="text-lg">{tax.rate}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxRatesLookup;