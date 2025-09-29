import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  CreditCard, 
  MessageSquare, 
  Users,
  Download 
} from 'lucide-react';
import { convertToCSV, downloadCSV, formatDateForCSV, formatCurrencyForCSV } from '@/lib/csvExport';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  totalPayments: number;
  newContactRequests: number;
  totalContactRequests: number;
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  variant = "default",
  prefix = "",
  suffix = ""
}: {
  title: string;
  value: number | string;
  icon: any;
  variant?: "default" | "success" | "warning" | "destructive";
  prefix?: string;
  suffix?: string;
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800";
      case "destructive":
        return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
      default:
        return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "destructive":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-blue-600 dark:text-blue-400";
    }
  };

  return (
    <Card className={`hover-elevate ${getVariantStyles()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${getIconColor()}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Import types (define interfaces at the top of the file)
  interface Payment {
    id: string;
    customerName: string;
    customerEmail: string;
    amount: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    packageName?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    createdAt: string;
    updatedAt: string;
  }

  interface ContactInquiry {
    id: string;
    name: string;
    email: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }

  // Fetch all data for comprehensive export
  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ['/api/admin/payments'],
  });

  const { data: contacts = [] } = useQuery<ContactInquiry[]>({
    queryKey: ['/api/admin/contacts'],
  });

  // Export functions
  const handleExportAllPayments = () => {
    if (payments.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no payments available to export.",
        variant: "destructive",
      });
      return;
    }

    const exportData = payments.map((payment) => ({
      'Payment ID': payment.id,
      'Customer Name': payment.customerName || '',
      'Customer Email': payment.customerEmail || '',
      'Amount': formatCurrencyForCSV(payment.amount),
      'Status': payment.status,
      'Package': payment.packageName || '',
      'Razorpay Order ID': payment.razorpayOrderId || '',
      'Razorpay Payment ID': payment.razorpayPaymentId || '',
      'Created Date': formatDateForCSV(payment.createdAt),
      'Updated Date': formatDateForCSV(payment.updatedAt)
    }));

    const csv = convertToCSV(exportData);
    const filename = `all_payments_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
    
    toast({
      title: "Export Successful",
      description: `Exported ${payments.length} payments to ${filename}`,
    });
  };

  const handleExportAllContacts = () => {
    if (contacts.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no contacts available to export.",
        variant: "destructive",
      });
      return;
    }

    const exportData = contacts.map((contact) => ({
      'Contact ID': contact.id,
      'Name': contact.name,
      'Email': contact.email,
      'Message': contact.message,
      'Status': contact.isRead ? 'Read' : 'Unread',
      'Date Submitted': formatDateForCSV(contact.createdAt)
    }));

    const csv = convertToCSV(exportData);
    const filename = `all_contacts_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
    
    toast({
      title: "Export Successful",
      description: `Exported ${contacts.length} contacts to ${filename}`,
    });
  };

  const handleExportDashboardStats = () => {
    if (!stats) {
      toast({
        title: "No Data to Export",
        description: "Dashboard statistics are not available.",
        variant: "destructive",
      });
      return;
    }
    
    const exportData = [{
      'Report Date': new Date().toISOString().split('T')[0],
      'Total Revenue': formatCurrencyForCSV(stats.totalRevenue),
      'Total Payments': stats.totalPayments,
      'Completed Payments': stats.completedPayments,
      'Pending Payments': stats.pendingPayments,
      'Total Contact Requests': stats.totalContactRequests,
      'New Contact Requests': stats.newContactRequests
    }];

    const csv = convertToCSV(exportData);
    const filename = `dashboard_stats_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
    
    toast({
      title: "Export Successful",
      description: `Dashboard statistics exported to ${filename}`,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard. Monitor key metrics and business performance.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard. Monitor key metrics and business performance.
          </p>
        </div>
        
        <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Unable to load dashboard statistics. Please check your connection and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Monitor your business performance and key metrics
          </p>
        </div>
        <Badge variant="outline" data-testid="badge-last-updated">
          Live Data
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Revenue"
          value={stats?.totalRevenue || 0}
          icon={TrendingUp}
          variant="success"
          prefix="₹"
        />
        
        <StatCard
          title="Pending Payments"
          value={stats?.pendingPayments || 0}
          icon={Clock}
          variant="warning"
        />
        
        <StatCard
          title="Completed Payments"
          value={stats?.completedPayments || 0}
          icon={CheckCircle}
          variant="success"
        />
        
        <StatCard
          title="Total Payments"
          value={stats?.totalPayments || 0}
          icon={CreditCard}
          variant="default"
        />
        
        <StatCard
          title="New Contact Requests"
          value={stats?.newContactRequests || 0}
          icon={MessageSquare}
          variant={stats?.newContactRequests ? "warning" : "default"}
        />
        
        <StatCard
          title="Total Contact Requests"
          value={stats?.totalContactRequests || 0}
          icon={Users}
          variant="default"
        />
      </div>

      {/* Data Export */}
      <Card className="hover-elevate">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Export
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Export your business data in CSV format for analysis and reporting
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button 
              onClick={handleExportDashboardStats}
              variant="outline"
              className="w-full"
              data-testid="button-export-dashboard-stats"
            >
              <Download className="h-4 w-4 mr-2" />
              Dashboard Stats
            </Button>
            <Button 
              onClick={handleExportAllPayments}
              variant="outline"
              className="w-full"
              data-testid="button-export-all-payments"
            >
              <Download className="h-4 w-4 mr-2" />
              All Payments
            </Button>
            <Button 
              onClick={handleExportAllContacts}
              variant="outline"
              className="w-full"
              data-testid="button-export-all-contacts"
            >
              <Download className="h-4 w-4 mr-2" />
              All Contacts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a 
              href="/admin/payments" 
              className="block text-sm text-primary hover:underline"
              data-testid="link-quick-payments"
            >
              → View Recent Payments
            </a>
            <a 
              href="/admin/contacts" 
              className="block text-sm text-primary hover:underline"
              data-testid="link-quick-contacts"
            >
              → Check New Messages
            </a>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="text-lg">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">All systems operational</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}