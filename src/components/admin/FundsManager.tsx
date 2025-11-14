import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export const FundsManager = () => {
  const queryClient = useQueryClient();
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState("");

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

  const totalFunds = Number(metrics?.total_funds || 0);
  const fundraisingGoal = Number(metrics?.fundraising_goal || 100000);

  const handleSetGoal = async () => {
    if (!newGoal || Number(newGoal) <= 0) {
      toast({
        title: "Invalid Goal",
        description: "Please enter a valid goal amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("site_metrics")
        .update({ fundraising_goal: Number(newGoal) })
        .eq("id", 1);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["site-metrics"] });
      toast({
        title: "Goal Updated",
        description: `Fundraising goal set to ₹${Number(newGoal).toFixed(2)}`,
      });
      setIsGoalDialogOpen(false);
      setNewGoal("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (transactionId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("fund_transactions")
        .update({ status: newStatus })
        .eq("id", transactionId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["admin-funds"] });
      toast({
        title: "Status Updated",
        description: "Transaction status has been updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (transactionsLoading) return <div>Loading transactions...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2 mb-4">
        <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Set Fundraising Goal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Fundraising Goal</DialogTitle>
              <DialogDescription>
                Set a new fundraising goal. Current goal: ₹{fundraisingGoal.toFixed(2)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal">New Goal Amount (₹)</Label>
                <Input
                  id="goal"
                  type="number"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Enter goal amount"
                />
              </div>
              <Button onClick={handleSetGoal} className="w-full">
                Set Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Donor Name</TableHead>
              <TableHead className="min-w-[150px]">UTR ID</TableHead>
              <TableHead className="min-w-[100px]">Amount</TableHead>
              <TableHead className="min-w-[200px]">Date & Time</TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.donor_name}</TableCell>
                <TableCell className="font-mono text-sm">{transaction.utr_id}</TableCell>
                <TableCell className="font-semibold">₹{Number(transaction.amount).toFixed(2)}</TableCell>
                <TableCell className="text-sm">{format(new Date(transaction.transaction_time), "PPp")}</TableCell>
                <TableCell>
                  <Select
                    value={transaction.status || "success"}
                    onValueChange={(value) => handleStatusChange(transaction.id, value)}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
