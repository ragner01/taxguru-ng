import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Download, Trash2, Calculator, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TaxRecord {
  id: string;
  date: string;
  type: string;
  income: number;
  taxOwed: number;
  year: number;
  notes?: string;
}

const TaxHistoryTracker = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState<TaxRecord[]>([
    {
      id: '1',
      date: '2024-01-15',
      type: 'Personal Income Tax',
      income: 5000000,
      taxOwed: 550000,
      year: 2024,
      notes: 'Annual tax calculation'
    },
    {
      id: '2',
      date: '2024-02-20',
      type: 'VAT',
      income: 1000000,
      taxOwed: 75000,
      year: 2024,
      notes: 'Quarterly VAT'
    }
  ]);

  const [newRecord, setNewRecord] = useState({
    type: '',
    income: '',
    taxOwed: '',
    year: new Date().getFullYear(),
    notes: ''
  });

  const addRecord = () => {
    if (!newRecord.type || !newRecord.income || !newRecord.taxOwed) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const record: TaxRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: newRecord.type,
      income: parseFloat(newRecord.income),
      taxOwed: parseFloat(newRecord.taxOwed),
      year: newRecord.year,
      notes: newRecord.notes
    };

    setRecords([record, ...records]);
    setNewRecord({ type: '', income: '', taxOwed: '', year: new Date().getFullYear(), notes: '' });
    
    toast({
      title: "Success",
      description: "Tax record added successfully"
    });
  };

  const deleteRecord = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
    toast({
      title: "Deleted",
      description: "Tax record removed"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getTotalTaxesByYear = (year: number) => {
    return records
      .filter(record => record.year === year)
      .reduce((total, record) => total + record.taxOwed, 0);
  };

  const currentYear = new Date().getFullYear();
  const years = [...new Set(records.map(record => record.year))].sort((a, b) => b - a);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Tax <span className="text-gradient">History Tracker</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Keep track of all your tax calculations and payments
        </p>
      </div>

      <Tabs defaultValue="records" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="records">Tax Records</TabsTrigger>
          <TabsTrigger value="add">Add Record</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <div className="grid gap-4">
            {records.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{record.type}</Badge>
                        <span className="text-sm text-muted-foreground">{record.date}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Income/Amount</Label>
                          <p className="font-semibold">{formatCurrency(record.income)}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Tax Owed</Label>
                          <p className="font-semibold text-primary">{formatCurrency(record.taxOwed)}</p>
                        </div>
                      </div>
                      {record.notes && (
                        <p className="text-sm text-muted-foreground">{record.notes}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRecord(record.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Tax Record</CardTitle>
              <CardDescription>Record a new tax calculation or payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tax Type</Label>
                  <Input
                    id="type"
                    placeholder="e.g., Personal Income Tax"
                    value={newRecord.type}
                    onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={newRecord.year}
                    onChange={(e) => setNewRecord({ ...newRecord, year: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="income">Income/Amount (₦)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="5000000"
                    value={newRecord.income}
                    onChange={(e) => setNewRecord({ ...newRecord, income: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="taxOwed">Tax Owed (₦)</Label>
                  <Input
                    id="taxOwed"
                    type="number"
                    placeholder="550000"
                    value={newRecord.taxOwed}
                    onChange={(e) => setNewRecord({ ...newRecord, taxOwed: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="Additional notes about this calculation"
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                />
              </div>

              <Button onClick={addRecord} className="w-full">
                <Calculator className="mr-2 h-4 w-4" />
                Add Record
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {years.map((year) => (
              <Card key={year}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {year} Tax Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Tax Paid:</span>
                      <span className="font-semibold">{formatCurrency(getTotalTaxesByYear(year))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Number of Records:</span>
                      <span className="font-semibold">
                        {records.filter(r => r.year === year).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxHistoryTracker;