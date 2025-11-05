import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const AdoptionRequests = ({ userId }: { userId: string }) => {
  const { data: requests, isLoading } = useQuery({
    queryKey: ["user-adoptions", userId],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("users_profile")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (!profile) return [];

      const { data, error } = await supabase
        .from("adoption_requests")
        .select(`
          *,
          pet:pets(name, breed, type, image_url)
        `)
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading your requests...</div>;
  if (!requests?.length) return <div className="text-muted-foreground">No adoption requests yet.</div>;

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[180px]">Pet</TableHead>
            <TableHead className="min-w-[120px]">Date</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[150px]">Admin Comment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests?.map((request: any) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {request.pet?.image_url && (
                    <img
                      src={request.pet.image_url}
                      alt={request.pet.name}
                      className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="font-medium truncate">{request.pet?.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {request.pet?.breed} - {request.pet?.type}
                    </div>
                  </div>
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
                  className="whitespace-nowrap"
                >
                  {request.request_status}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">{request.admin_comment || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
