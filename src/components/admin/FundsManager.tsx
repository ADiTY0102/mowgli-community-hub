import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

export const FundsManager = () => {
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["admin-funds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fund_transactions")
        .select("*")
        .order("transaction_time", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
// updated
  const { data: metrics } = useQuery({
    queryKey: ["site-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_metrics")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const totalFunds = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  if (transactionsLoading) return <div>Loading transactions...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Funds Raised</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalFunds.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pets Adopted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total_pets_adopted || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <ScrollArea className="w-full">
          <div className="min-w-[700px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Donor Name</TableHead>
                  <TableHead className="min-w-[150px]">UTR ID</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="min-w-[200px]">Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.donor_name}</TableCell>
                    <TableCell className="font-mono text-sm">{transaction.utr_id}</TableCell>
                    <TableCell className="font-semibold">₹{Number(transaction.amount).toFixed(2)}</TableCell>
                    <TableCell className="text-sm">{format(new Date(transaction.transaction_time), "PPp")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
