import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PiggyBank, TrendingDown, Calculator, Lightbulb, Target } from 'lucide-react';

const TaxSavingsCalculator = () => {
  const [currentIncome, setCurrentIncome] = useState('');
  const [pensionContribution, setPensionContribution] = useState('');
  const [nhfContribution, setNhfContribution] = useState('');
  const [nhisContribution, setNhisContribution] = useState('');
  const [lifeInsurance, setLifeInsurance] = useState('');

  const calculateTax = (taxableIncome: number) => {
    let tax = 0;
    const brackets = [
      { min: 0, max: 300000, rate: 0.07 },
      { min: 300000, max: 600000, rate: 0.11 },
      { min: 600000, max: 1100000, rate: 0.15 },
      { min: 1100000, max: 1600000, rate: 0.19 },
      { min: 1600000, max: 3200000, rate: 0.21 },
      { min: 3200000, max: Infinity, rate: 0.24 }
    ];

    for (const bracket of brackets) {
      if (taxableIncome > bracket.min) {
        const taxableAtThisBracket = Math.min(taxableIncome - bracket.min, bracket.max - bracket.min);
        tax += taxableAtThisBracket * bracket.rate;
      }
    }

    return tax;
  };

  const income = parseFloat(currentIncome) || 0;
  const pension = Math.min(parseFloat(pensionContribution) || 0, income * 0.18); // Max 18%
  const nhf = Math.min(parseFloat(nhfContribution) || 0, income * 0.025); // Max 2.5%
  const nhis = Math.min(parseFloat(nhisContribution) || 0, income * 0.05); // Max 5%
  const insurance = Math.min(parseFloat(lifeInsurance) || 0, income * 0.15); // Max 15%

  const totalDeductions = pension + nhf + nhis + insurance;
  const taxableIncomeWithoutDeductions = Math.max(0, income - 200000); // Basic relief
  const taxableIncomeWithDeductions = Math.max(0, income - 200000 - totalDeductions);

  const taxWithoutDeductions = calculateTax(taxableIncomeWithoutDeductions);
  const taxWithDeductions = calculateTax(taxableIncomeWithDeductions);
  const savings = taxWithoutDeductions - taxWithDeductions;
  const savingsPercentage = taxWithoutDeductions > 0 ? (savings / taxWithoutDeductions) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

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
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5" />
                  Your Tax Savings
                </CardTitle>
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
                    <div className="flex justify-between">
                      <span>Basic Relief:</span>
                      <span>{formatCurrency(200000)}</span>
                    </div>
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
                          Potential additional tax savings: {formatCurrency(strategy.potential * 0.21)}
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
                      <td className="text-right p-2">{formatCurrency(Math.max(0, income - 200000))}</td>
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
                      <td className="text-right p-2">{formatCurrency(Math.max(0, income - 200000 - income * 0.375))}</td>
                      <td className="text-right p-2">{formatCurrency(calculateTax(Math.max(0, income - 200000 - income * 0.375)))}</td>
                      <td className="text-right p-2 text-primary">
                        {formatCurrency(taxWithoutDeductions - calculateTax(Math.max(0, income - 200000 - income * 0.375)))}
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