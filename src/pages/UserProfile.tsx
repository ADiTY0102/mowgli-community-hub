import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonatePetForm } from "@/components/user/DonatePetForm";
import { AdoptionRequests } from "@/components/user/AdoptionRequests";
import { EditProfileForm } from "@/components/user/EditProfileForm";

const UserProfile = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
          <Button variant="outline" onClick={signOut} className="w-full sm:w-auto">
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 h-auto">
            <TabsTrigger value="info" className="text-xs sm:text-sm">Profile Info</TabsTrigger>
            <TabsTrigger value="donate" className="text-xs sm:text-sm">Donate Pet</TabsTrigger>
            <TabsTrigger value="adopt" className="text-xs sm:text-sm">Adoptions</TabsTrigger>
            <TabsTrigger value="manage" className="text-xs sm:text-sm">Manage</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user.user_metadata?.full_name || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.user_metadata?.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{user.user_metadata?.address || "Not provided"}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donate">
            <Card>
              <CardHeader>
                <CardTitle>Donate a Pet</CardTitle>
              </CardHeader>
              <CardContent>
                <DonatePetForm userId={user.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adopt">
            <Card>
              <CardHeader>
                <CardTitle>My Adoption Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <AdoptionRequests userId={user.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Manage Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <EditProfileForm userId={user.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
