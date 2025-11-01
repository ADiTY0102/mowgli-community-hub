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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Profile Info</TabsTrigger>
            <TabsTrigger value="donate">Donate Pet</TabsTrigger>
            <TabsTrigger value="adopt">Adoption Requests</TabsTrigger>
            <TabsTrigger value="manage">Manage Profile</TabsTrigger>
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
