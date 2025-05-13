/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// src/pages/payments-dashboard.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search, CalendarIcon, RefreshCw } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

// Types
interface User {
  $id: string;
  name: string;
  email: string;
  amount: number;
  $createdAt: string;
  checked: boolean;
  status: string;
  tx_ref?: string;
}

interface PaymentData {
  initiatePayment: User[];
  successfulPayment: User[];
}

const PaymentDashboard = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>("initiated");

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/proxy-flutterwave/payment-data');
      if (!response.ok) {
        throw new Error('Failed to fetch payment data');
      }
      const data = await response.json();
      console.log("Fetched payment data:", data);
      setPaymentData(data.data);
    } catch (error) {
      console.error("Failed to fetch payment data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = (users: User[] | undefined) => {
    if (!users) return [];
    
    return users.filter((user) => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.tx_ref?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = !date || format(new Date(user.$createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      
      return matchesSearch && matchesDate;
    });
  };

  const getTotal = (users: User[] | undefined) => {
    if (!users) return 0;
    return users.reduce((total, user) => total + (user.amount || 0), 0);
  };

  const initiatedUsers = filterUsers(paymentData?.initiatePayment);
  const successfulUsers = filterUsers(paymentData?.successfulPayment);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Payment Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchPaymentData} className="flex items-center gap-2">
            <RefreshCw size={16} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Initiated</CardTitle>
            <CardDescription>Payments awaiting confirmation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="animate-spin" /> : paymentData?.initiatePayment.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Successful</CardTitle>
            <CardDescription>Confirmed payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="animate-spin" /> : paymentData?.successfulPayment.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>From successful payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="animate-spin" /> : `${getTotal(paymentData?.successfulPayment).toLocaleString()}`}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or transaction ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full md:w-auto justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Filter by date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => setDate(newDate)}
              initialFocus
            />
            {date && (
              <div className="p-2 border-t border-border">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => setDate(undefined)}
                >
                  Clear
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <Tabs defaultValue="initiated" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="initiated">Initiated Payments</TabsTrigger>
          <TabsTrigger value="successful">Successful Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="initiated" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Initiated Payments</CardTitle>
              <CardDescription>
                Payments that have been initiated but not yet confirmed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : initiatedUsers.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {initiatedUsers.map((user) => (
                        <TableRow key={user.$id}>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </TableCell>
                          <TableCell>{format(new Date(user.$createdAt), 'MMM d, yyyy')}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{user.amount?.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableCaption>
                      {initiatedUsers.length === 0 && searchTerm ? 
                        "No results match your search." : 
                        `Showing ${initiatedUsers.length} initiated payments.`}
                    </TableCaption>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No initiated payments found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="successful" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Successful Payments</CardTitle>
              <CardDescription>
                Payments that have been successfully processed and confirmed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : successfulUsers.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {successfulUsers.map((user) => (
                        <TableRow key={user.$id}>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </TableCell>
                          <TableCell>{format(new Date(user.$createdAt), 'MMM d, yyyy')}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                              Successful
                            </Badge>
                          </TableCell>
                          <TableCell>{user.amount?.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableCaption>
                      {successfulUsers.length === 0 && searchTerm ? 
                        "No results match your search." : 
                        `Showing ${successfulUsers.length} successful payments.`
                        }
                    </TableCaption>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No successful payments found.
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-end">
                <div className="text-sm text-muted-foreground">
                  Total Amount: <span className="font-bold text-foreground">${getTotal(successfulUsers).toLocaleString()}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentDashboard;