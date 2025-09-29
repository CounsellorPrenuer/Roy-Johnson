import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, MessageSquare, Mail, Calendar, Eye, Check, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { convertToCSV, downloadCSV, formatDateForCSV } from '@/lib/csvExport';

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function ContactStatusBadge({ isRead }: { isRead: boolean }) {
  return (
    <Badge 
      className={
        isRead 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      }
    >
      {isRead ? 'Read' : 'New'}
    </Badge>
  );
}

function MessagePreviewDialog({ contact }: { contact: ContactInquiry }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest(`/api/admin/contacts/${id}/read`, 'PATCH'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contacts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Message Marked as Read",
        description: "The contact request has been updated",
      });
    },
  });

  const handleMarkAsRead = () => {
    if (!contact.isRead) {
      markAsReadMutation.mutate(contact.id);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          data-testid={`button-view-message-${contact.id}`}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Contact Message
            </DialogTitle>
            <ContactStatusBadge isRead={contact.isRead} />
          </div>
          <DialogDescription>
            Message from {contact.name} on {format(new Date(contact.createdAt), 'PPP')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-sm font-medium">{contact.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-sm font-medium">{contact.email}</p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Message</label>
            <div className="mt-1 p-3 bg-muted rounded-md">
              <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>
          
          {!contact.isRead && (
            <div className="flex justify-end">
              <Button 
                onClick={handleMarkAsRead}
                disabled={markAsReadMutation.isPending}
                data-testid="button-mark-as-read"
              >
                <Check className="w-4 h-4 mr-1" />
                {markAsReadMutation.isPending ? 'Marking...' : 'Mark as Read'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ContactManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const { data: contacts = [], isLoading, error } = useQuery<ContactInquiry[]>({
    queryKey: ['/api/admin/contacts'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // CSV Export function
  const handleExportCSV = () => {
    if (filteredContacts.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no contacts matching your current filters to export.",
        variant: "destructive",
      });
      return;
    }

    const exportData = filteredContacts.map(contact => ({
      'Contact ID': contact.id,
      'Name': contact.name,
      'Email': contact.email,
      'Message': contact.message,
      'Status': contact.isRead ? 'Read' : 'Unread',
      'Date Submitted': formatDateForCSV(contact.createdAt)
    }));

    const csv = convertToCSV(exportData);
    const filename = `contacts_export_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
    
    toast({
      title: "Export Successful",
      description: `Exported ${filteredContacts.length} contacts to ${filename}`,
    });
  };

  // Filter contacts based on search and status
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'new' && !contact.isRead) ||
      (statusFilter === 'read' && contact.isRead);
    
    return matchesSearch && matchesStatus;
  });

  const newCount = contacts.filter(c => !c.isRead).length;
  const readCount = contacts.filter(c => c.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Contact Management</h2>
        <p className="text-muted-foreground">
          View and manage contact form submissions and customer inquiries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <Mail className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read Messages</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or message content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-contacts"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
                data-testid="select-status-filter"
              >
                <option value="all">All Messages</option>
                <option value="new">New Messages</option>
                <option value="read">Read Messages</option>
              </select>
            </div>
            <Button 
              onClick={handleExportCSV}
              variant="outline"
              className="sm:w-auto"
              data-testid="button-export-contacts"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Messages</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {filteredContacts.length} of {contacts.length} messages
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive">Error loading contacts. Please try again.</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No contacts match your search criteria' 
                  : 'No contact messages found'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Message Preview</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow 
                      key={contact.id} 
                      className={!contact.isRead ? "bg-yellow-50/50 dark:bg-yellow-950/20" : ""}
                      data-testid={`contact-row-${contact.id}`}
                    >
                      <TableCell className="font-medium">
                        {contact.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {contact.email}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-muted-foreground truncate">
                          {contact.message.length > 60 
                            ? `${contact.message.substring(0, 60)}...` 
                            : contact.message
                          }
                        </p>
                      </TableCell>
                      <TableCell>
                        <ContactStatusBadge isRead={contact.isRead} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(contact.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <MessagePreviewDialog contact={contact} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}