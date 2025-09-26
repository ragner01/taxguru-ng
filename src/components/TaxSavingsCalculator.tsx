import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PiggyBank, TrendingDown, Calculator, Lightbulb, Target } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NEW_PIT_BRACKETS, OLD_PIT_BRACKETS, calculateProgressiveTax, formatCurrency } from '@/lib/tax';
import { downloadTaxSummaryPdf } from '@/lib/pdf';

const TaxSavingsCalculator = () => {
  const [currentIncome, setCurrentIncome] = useState('');
  const [pensionContribution, setPensionContribution] = useState('');
  const [nhfContribution, setNhfContribution] = useState('');
  const [nhisContribution, setNhisContribution] = useState('');
  const [lifeInsurance, setLifeInsurance] = useState('');
  const [taxYear, setTaxYear] = useState<'old' | 'new'>('new');

  const calculateTax = (taxableIncome: number) => {
    const brackets = taxYear === 'new' ? NEW_PIT_BRACKETS : OLD_PIT_BRACKETS;
    return calculateProgressiveTax(taxableIncome, brackets).total;
  };

  const income = parseFloat(currentIncome) || 0;
  const pension = Math.min(parseFloat(pensionContribution) || 0, income * 0.18); // Max 18%
  const nhf = Math.min(parseFloat(nhfContribution) || 0, income * 0.025); // Max 2.5%
  const nhis = Math.min(parseFloat(nhisContribution) || 0, income * 0.05); // Max 5%
  const insurance = Math.min(parseFloat(lifeInsurance) || 0, income * 0.15); // Max 15%

  const totalDeductions = pension + nhf + nhis + insurance;
  const baseAllowance = taxYear === 'new' ? 0 : 200000;
  const taxableIncomeWithoutDeductions = Math.max(0, income - baseAllowance);
  const taxableIncomeWithDeductions = Math.max(0, income - baseAllowance - totalDeductions);

  const taxWithoutDeductions = calculateTax(taxableIncomeWithoutDeductions);
  const taxWithDeductions = calculateTax(taxableIncomeWithDeductions);
  const savings = taxWithoutDeductions - taxWithDeductions;
  const savingsPercentage = taxWithoutDeductions > 0 ? (savings / taxWithoutDeductions) * 100 : 0;

  const topMarginalRate = useMemo(() => (taxYear === 'new' ? 0.25 : 0.24), [taxYear]);

  const strategies = [
    {
      title: 'Maximize Pension Contributions',
      description: 'Contribute up to 18% of your income to registered pension schemes',
      potential: Math.max(0, (income * 0.18) - pension),
      category: 'retirement'
    },
    {
      title: 'National Housing Fund (NHF)',
      description: 'Contribute up to 2.5% of your income to NHF',
      potential: Math.max(0, (income * 0.025) - nhf),
      category: 'housing'
    },
    {
      title: 'National Health Insurance Scheme (NHIS)',
      description: 'Health insurance premiums up to 5% of income are deductible',
      potential: Math.max(0, (income * 0.05) - nhis),
      category: 'health'
    },
    {
      title: 'Life Insurance Premiums',
      description: 'Life insurance premiums up to 15% of income are deductible',
      potential: Math.max(0, (income * 0.15) - insurance),
      category: 'insurance'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'retirement': return <Target className="h-4 w-4" />;
      case 'housing': return <PiggyBank className="h-4 w-4" />;
      case 'health': return <Lightbulb className="h-4 w-4" />;
      case 'insurance': return <TrendingDown className="h-4 w-4" />;
      default: return <Calculator className="h-4 w-4" />;
    }
  };

  const handleDownloadPdf = () => {
    const sections = [
      {
        heading: 'Key Figures',
        lines: [
          `Tax rules: ${taxYear === 'new' ? '2026 onwards' : '2025 and earlier'}`,
          `Gross income: ${formatCurrency(income)}`,
          taxYear === 'old' ? `Basic relief: ${formatCurrency(baseAllowance)}` : 'Basic relief: Not applicable under new rules',
          `Total deductions: ${formatCurrency(totalDeductions)}`,
          `Tax (no deductions): ${formatCurrency(taxWithoutDeductions)}`,
          `Tax (with deductions): ${formatCurrency(taxWithDeductions)}`,
          `Annual savings: ${formatCurrency(savings)} (${savingsPercentage.toFixed(1)}%)`
        ]
      }
    ];

    sections.push({
      heading: 'Deduction Limits',
      lines: [
        `Pension contributions capped at ${formatCurrency(income * 0.18)} (18% of income).`,
        `NHF contributions capped at ${formatCurrency(income * 0.025)} (2.5% of income).`,
        `NHIS contributions capped at ${formatCurrency(income * 0.05)} (5% of income).`,
        `Life insurance premiums capped at ${formatCurrency(income * 0.15)} (15% of income).`
      ]
    });

    downloadTaxSummaryPdf({
      title: 'Tax Savings Summary',
      subtitle: 'Comparison of deductions and effective tax savings',
      sections,
      filename: 'tax-savings-summary.pdf'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Tax <span className="text-gradient">Savings Calculator</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover how much you can save with smart tax planning strategies
        </p>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Input Your Details</CardTitle>
                <CardDescription>Enter your income and current deductions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="taxYear">Tax Year Rules</Label>
                  <Select value={taxYear} onValueChange={(value) => setTaxYear(value as 'old' | 'new')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tax year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">2026 onwards (Reform Acts)</SelectItem>
                      <SelectItem value="old">2025 and earlier</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {taxYear === 'new'
                      ? 'Applies ₦800,000 tax-free threshold with 15%-25% bands and withholding offsets.'
                      : 'Uses legacy CRA of ₦200,000 and 7%-24% bands for earlier filings.'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="income">Annual Income (₦)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="5000000"
                    value={currentIncome}
                    onChange={(e) => setCurrentIncome(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="pension">Pension Contribution (₦)</Label>
                  <Input
                    id="pension"
                    type="number"
                    placeholder="450000"
                    value={pensionContribution}
                    onChange={(e) => setPensionContribution(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum: {formatCurrency(income * 0.18)} (18% of income)
                  </p>
                </div>

                <div>
                  <Label htmlFor="nhf">NHF Contribution (₦)</Label>
                  <Input
                    id="nhf"
                    type="number"
                    placeholder="125000"
                    value={nhfContribution}
                    onChange={(e) => setNhfContribution(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum: {formatCurrency(income * 0.025)} (2.5% of income)
                  </p>
                </div>

                <div>
                  <Label htmlFor="nhis">NHIS Contribution (₦)</Label>
                  <Input
                    id="nhis"
                    type="number"
                    placeholder="250000"
                    value={nhisContribution}
                    onChange={(e) => setNhisContribution(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum: {formatCurrency(income * 0.05)} (5% of income)
                  </p>
                </div>

                <div>
                  <Label htmlFor="insurance">Life Insurance Premium (₦)</Label>
                  <Input
                    id="insurance"
                    type="number"
                    placeholder="750000"
                    value={lifeInsurance}
                    onChange={(e) => setLifeInsurance(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum: {formatCurrency(income * 0.15)} (15% of income)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="flex items-center gap-2">
                    <PiggyBank className="h-5 w-5" />
                    Your Tax Savings
                  </CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={handleDownloadPdf}>
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded bg-muted">
                    <p className="text-sm text-muted-foreground">Tax Without Deductions</p>
                    <p className="text-xl font-bold">{formatCurrency(taxWithoutDeductions)}</p>
                  </div>
                  <div className="p-4 rounded bg-muted">
                    <p className="text-sm text-muted-foreground">Tax With Deductions</p>
                    <p className="text-xl font-bold text-primary">{formatCurrency(taxWithDeductions)}</p>
                  </div>
                </div>

                <div className="p-6 rounded border-2 border-primary bg-primary/5">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Annual Tax Savings</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(savings)}</p>
                    <Badge variant="outline" className="mt-2">
                      {savingsPercentage.toFixed(1)}% reduction
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Breakdown</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Gross Income:</span>
                      <span>{formatCurrency(income)}</span>
                    </div>
                    {baseAllowance > 0 && (
                      <div className="flex justify-between">
                        <span>Basic Relief:</span>
                        <span>{formatCurrency(baseAllowance)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Total Deductions:</span>
                      <span>{formatCurrency(totalDeductions)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Taxable Income:</span>
                      <span>{formatCurrency(taxableIncomeWithDeductions)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {strategies.map((strategy, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getCategoryIcon(strategy.category)}
                    {strategy.title}
                  </CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Additional Deduction Potential:</span>
                      <Badge variant="outline">
                        {formatCurrency(strategy.potential)}
                      </Badge>
                    </div>
                    {strategy.potential > 0 && (
                      <div className="p-3 rounded bg-primary/5 border border-primary/20">
                        <p className="text-sm text-primary">
                          Potential additional tax savings: {formatCurrency(strategy.potential * topMarginalRate)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Comparison</CardTitle>
              <CardDescription>See how different contribution levels affect your tax burden</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Scenario</th>
                      <th className="text-right p-2">Total Deductions</th>
                      <th className="text-right p-2">Taxable Income</th>
                      <th className="text-right p-2">Tax Owed</th>
                      <th className="text-right p-2">Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">No Deductions</td>
                      <td className="text-right p-2">{formatCurrency(0)}</td>
                      <td className="text-right p-2">{formatCurrency(Math.max(0, income - baseAllowance))}</td>
                      <td className="text-right p-2">{formatCurrency(taxWithoutDeductions)}</td>
                      <td className="text-right p-2">-</td>
                    </tr>
                    <tr className="border-b bg-muted/50">
                      <td className="p-2 font-medium">Current Setup</td>
                      <td className="text-right p-2">{formatCurrency(totalDeductions)}</td>
                      <td className="text-right p-2">{formatCurrency(taxableIncomeWithDeductions)}</td>
                      <td className="text-right p-2">{formatCurrency(taxWithDeductions)}</td>
                      <td className="text-right p-2 text-primary">{formatCurrency(savings)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Maximum Deductions</td>
                      <td className="text-right p-2">{formatCurrency(income * 0.375)}</td>
                      <td className="text-right p-2">{formatCurrency(Math.max(0, income - baseAllowance - income * 0.375))}</td>
                      <td className="text-right p-2">{formatCurrency(calculateTax(Math.max(0, income - baseAllowance - income * 0.375)))}</td>
                      <td className="text-right p-2 text-primary">
                        {formatCurrency(taxWithoutDeductions - calculateTax(Math.max(0, income - baseAllowance - income * 0.375)))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxSavingsCalculator;
