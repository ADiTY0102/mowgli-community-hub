import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const Fundraising = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");

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

  const { data: transactions } = useQuery({
    queryKey: ["recent-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fund_transactions")
        .select("*")
        .order("transaction_time", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const totalFunds = Number(metrics?.total_funds || 0);
  const fundGoal = 100000; // Set a goal of ₹1,00,000
  const progressPercentage = Math.min((totalFunds / fundGoal) * 100, 100);

  const handleDonateClick = () => {
    // Razorpay integration will go here
    toast({
      title: "Razorpay Integration",
      description: "Payment gateway integration is in progress. Please contact admin for donations.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Help Us Save More Lives
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every contribution makes a difference in giving pets a second chance at life
          </p>
        </div>
      </section>

      {/* Fundraising Stats */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl">Fundraising Progress</CardTitle>
              <CardDescription>Help us reach our goal to care for more animals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Raised</span>
                  <span className="font-semibold">₹{totalFunds.toLocaleString()}</span>
                </div>
                <Progress value={progressPercentage} className="h-4" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Goal: ₹{fundGoal.toLocaleString()}</span>
                  <span className="font-semibold">{progressPercentage.toFixed(1)}%</span>
                </div>
              </div>

              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full text-lg">
                    <Heart className="mr-2 h-5 w-5" />
                    Donate Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Make a Donation</DialogTitle>
                    <DialogDescription>
                      Your contribution helps us care for animals in need
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="donor_name">Your Name</Label>
                      <Input
                        id="donor_name"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                      />
                    </div>
                    <Button onClick={handleDonateClick} className="w-full">
                      Proceed to Payment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Impact Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <Heart className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Pets Adopted</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{metrics?.total_pets_adopted || 0}</p>
                <p className="text-sm text-muted-foreground">Lives changed forever</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-secondary mb-2" />
                <CardTitle>Total Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">₹{totalFunds.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Funds raised to date</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-accent mb-2" />
                <CardTitle>Pets Donated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{metrics?.total_pets_donated || 0}</p>
                <p className="text-sm text-muted-foreground">Pets waiting for homes</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          {transactions && transactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Contributions</CardTitle>
                <CardDescription>Thank you to our generous donors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{transaction.donor_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.transaction_time).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-primary">
                        ₹{Number(transaction.amount).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default Fundraising;
