import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersManager } from "@/components/admin/UsersManager";
import { AdoptionsManager } from "@/components/admin/AdoptionsManager";
import { DonationsManager } from "@/components/admin/DonationsManager";
import { FundsManager } from "@/components/admin/FundsManager";
import { GalleryManager } from "@/components/admin/GalleryManager";

const AdminDashboard = () => {
  const { user, signOut, loading } = useAuth();

  const { data: isAdmin, isLoading: roleLoading } = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!user,
  });

  if (loading || roleLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (!isAdmin) {
    return <Navigate to="/profile" />;
  }
  // updated
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={signOut} className="w-full sm:w-auto">
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="adoptions">Adoptions</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="funds">Funds</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <UsersManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adoptions">
            <Card>
              <CardHeader>
                <CardTitle>Manage Adoptions</CardTitle>
              </CardHeader>
              <CardContent>
                <AdoptionsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>Manage Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <DonationsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funds">
            <Card>
              <CardHeader>
                <CardTitle>Fund Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <FundsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle>Gallery Management</CardTitle>
              </CardHeader>
              <CardContent>
                <GalleryManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
