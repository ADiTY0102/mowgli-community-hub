import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const AdoptionsManager = () => {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["admin-adoptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("adoption_requests")
        .select(`
          *,
          user:users_profile!adoption_requests_user_id_fkey(full_name, email, phone),
          pet:pets(name, breed, type)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error: requestError } = await supabase
        .from("adoption_requests")
        .update({ request_status: status })
        .eq("id", id);
      
      if (requestError) throw requestError;

      // If approved, mark the pet as adopted
      if (status === "approved") {
        const request = requests?.find((r: any) => r.id === id);
        if (request?.pet_id) {
          const { error: petError } = await supabase
            .from("pets")
            .update({ status: "adopted" })
            .eq("id", request.pet_id);
          
          if (petError) throw petError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-adoptions"] });
      toast({ title: "Adoption request updated" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) return <div>Loading adoption requests...</div>;

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">User</TableHead>
            <TableHead className="min-w-[150px]">Pet</TableHead>
            <TableHead className="min-w-[150px]">Contact</TableHead>
            <TableHead className="min-w-[120px]">Date</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[180px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests?.map((request: any) => (
            <TableRow key={request.id}>
              <TableCell>{request.user?.full_name}</TableCell>
              <TableCell>
                {request.pet?.name} ({request.pet?.breed})
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{request.user?.email}</div>
                  <div className="text-muted-foreground">{request.user?.phone}</div>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">{format(new Date(request.created_at), "PP")}</TableCell>
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
                <div className="flex gap-2 flex-nowrap">
                  <Button
                    size="sm"
                    variant="outline"
                    className="whitespace-nowrap"
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
                    className="whitespace-nowrap"
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