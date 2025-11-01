import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const DonationsManager = () => {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["admin-donations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donation_requests")
        .select(`
          *,
          user:users_profile!donation_requests_user_id_fkey(full_name, email, phone),
          pet:pets(name, breed, type, age, disease_reason)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error: requestError } = await supabase
        .from("donation_requests")
        .update({ request_status: status })
        .eq("id", id);
      
      if (requestError) throw requestError;

      // If approved, also update pet status
      if (status === "approved") {
        const request = requests?.find((r: any) => r.id === id);
        if (request?.pet_id) {
          const { error: petError } = await supabase
            .from("pets")
            .update({ status: "approved" })
            .eq("id", request.pet_id);
          
          if (petError) throw petError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-donations"] });
      toast({ title: "Donation request updated" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) return <div>Loading donation requests...</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Donor</TableHead>
            <TableHead>Pet Details</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests?.map((request: any) => (
            <TableRow key={request.id}>
              <TableCell>{request.user?.full_name}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium">{request.pet?.name} ({request.pet?.breed})</div>
                  <div className="text-muted-foreground">
                    {request.pet?.type}, Age: {request.pet?.age}
                  </div>
                  {request.pet?.disease_reason && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Reason: {request.pet?.disease_reason}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{request.user?.email}</div>
                  <div className="text-muted-foreground">{request.user?.phone}</div>
                </div>
              </TableCell>
              <TableCell>{format(new Date(request.created_at), "PPP")}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    request.request_status === "approved"
                      ? "default"
                      : request.request_status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {request.request_status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateStatusMutation.mutate({ id: request.id, status: "approved" })
                    }
                    disabled={request.request_status === "approved"}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateStatusMutation.mutate({ id: request.id, status: "rejected" })
                    }
                    disabled={request.request_status === "rejected"}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
// updated