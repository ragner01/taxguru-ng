import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Bell, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TaxDeadline {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'deadline' | 'reminder' | 'filing';
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
}

const TaxCalendar = () => {
  const { toast } = useToast();
  const [deadlines] = useState<TaxDeadline[]>([
    {
      id: '1',
      title: 'Personal Income Tax Filing',
      date: '2025-03-31',
      description: 'Annual Personal Income Tax returns must be filed',
      type: 'deadline',
      priority: 'high'
    },
    {
      id: '2',
      title: 'VAT Returns - Q1',
      date: '2025-01-21',
      description: 'Quarterly VAT returns for Q4 2024',
      type: 'filing',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Company Income Tax',
      date: '2025-06-30',
      description: 'Companies must file their annual tax returns',
      type: 'deadline',
      priority: 'high'
    },
    {
      id: '4',
      title: 'WHT Remittance',
      date: '2025-01-21',
      description: 'Monthly Withholding Tax remittance for December 2024',
      type: 'filing',
      priority: 'medium'
    },
    {
      id: '5',
      title: 'PAYE Monthly Returns',
      date: '2025-01-10',
      description: 'Monthly PAYE returns for December 2024',
      type: 'filing',
      priority: 'medium'
    },
    {
      id: '6',
      title: 'CGT Assessment',
      date: '2025-01-31',
      description: 'Capital Gains Tax assessment deadline',
      type: 'deadline',
      priority: 'medium'
    },
    {
      id: '7',
      title: 'Education Tax Filing',
      date: '2025-03-31',
      description: 'Annual Education Tax returns',
      type: 'deadline',
      priority: 'low'
    },
    {
      id: '8',
      title: 'Property Tax Assessment',
      date: '2025-12-31',
      description: 'Annual property tax assessment',
      type: 'reminder',
      priority: 'low'
    }
  ]);

  const getDaysUntilDeadline = (date: string) => {
    const deadline = new Date(date);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineStatus = (date: string) => {
    const days = getDaysUntilDeadline(date);
    if (days < 0) return { status: 'overdue', color: 'destructive' };
    if (days <= 7) return { status: 'urgent', color: 'destructive' };
    if (days <= 30) return { status: 'upcoming', color: 'default' };
    return { status: 'future', color: 'secondary' };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <AlertCircle className="h-4 w-4" />;
      case 'filing': return <FileText className="h-4 w-4" />;
      case 'reminder': return <Bell className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sortedDeadlines = [...deadlines].sort((a, b) => {
    const daysA = getDaysUntilDeadline(a.date);
    const daysB = getDaysUntilDeadline(b.date);
    return daysA - daysB;
  });

  const upcomingDeadlines = sortedDeadlines.filter(d => getDaysUntilDeadline(d.date) >= 0 && getDaysUntilDeadline(d.date) <= 30);
  const urgentDeadlines = sortedDeadlines.filter(d => getDaysUntilDeadline(d.date) <= 7 && getDaysUntilDeadline(d.date) >= 0);

  const setReminder = (deadline: TaxDeadline) => {
    toast({
      title: "Reminder Set",
      description: `You'll be reminded about ${deadline.title} closer to the deadline.`
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Tax <span className="text-gradient">Calendar & Deadlines</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Never miss a tax deadline with our comprehensive calendar
        </p>
      </div>

      {/* Urgent Deadlines Alert */}
      {urgentDeadlines.length > 0 && (
        <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Urgent Deadlines
            </CardTitle>
            <CardDescription>
              You have {urgentDeadlines.length} deadline(s) within the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {urgentDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between p-2 rounded bg-background">
                  <div>
                    <p className="font-medium">{deadline.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {getDaysUntilDeadline(deadline.date)} days remaining
                    </p>
                  </div>
                  <Badge variant="destructive">Urgent</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Deadlines */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Deadlines (Next 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => {
                const status = getDeadlineStatus(deadline.date);
                const daysUntil = getDaysUntilDeadline(deadline.date);
                
                return (
                  <Card key={deadline.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(deadline.type)}
                            <h3 className="font-semibold">{deadline.title}</h3>
                            <Badge variant={getPriorityColor(deadline.priority)}>
                              {deadline.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {deadline.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(deadline.date)}
                            </span>
                            <Badge variant={status.color as any}>
                              {daysUntil === 0 ? 'Due Today' : 
                               daysUntil === 1 ? '1 day left' : 
                               `${daysUntil} days left`}
                            </Badge>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReminder(deadline)}
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          Remind Me
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* All Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>All Tax Deadlines</CardTitle>
            <CardDescription>Complete list of Nigerian tax deadlines for 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedDeadlines.map((deadline) => {
                const status = getDeadlineStatus(deadline.date);
                const daysUntil = getDaysUntilDeadline(deadline.date);
                
                return (
                  <div key={deadline.id} className="flex items-center justify-between p-3 rounded border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(deadline.type)}
                      <div>
                        <p className="font-medium">{deadline.title}</p>
                        <p className="text-xs text-muted-foreground">{deadline.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(deadline.date).toLocaleDateString()}
                      </span>
                      <Badge variant={status.color as any} className="text-xs">
                        {daysUntil < 0 ? 'Overdue' : 
                         daysUntil === 0 ? 'Today' : 
                         `${daysUntil}d`}
                      </Badge>
                      <Badge variant={getPriorityColor(deadline.priority)} className="text-xs">
                        {deadline.priority}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxCalendar;