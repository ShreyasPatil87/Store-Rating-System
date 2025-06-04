import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateStoreSchema } from "@shared/validation";
import { z } from "zod";
import { UserRole } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type FormData = z.infer<typeof validateStoreSchema>;

interface AddStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddStoreDialog({ open, onOpenChange }: AddStoreDialogProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const { data: owners = [], isLoading: loadingOwners } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const users = await response.json();
      return users.filter((user: any) => user.role === UserRole.OWNER);
    },
    enabled: open,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(validateStoreSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      ownerId: undefined,
    },
  });

  const addStoreMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/admin/stores", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/statistics"] });
      toast({
        title: "Store created",
        description: "The store has been created successfully.",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create store",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setSubmitting(false);
    },
  });

  const onSubmit = (data: FormData) => {
    setSubmitting(true);
    addStoreMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl shadow-xl border border-gray-200">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-bold text-primary">Add New Store</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in the details below to create a new store and assign an owner.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-sm text-gray-700">Store Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg. Patil Electronics"
                      className="rounded-xl shadow-sm"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500">Between 20–60 characters.</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-sm text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="store@example.com"
                      type="email"
                      className="rounded-xl shadow-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-sm text-gray-700">Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter store address"
                      className="resize-none rounded-xl shadow-sm"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500">Max 400 characters.</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-sm text-gray-700">Store Owner</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl shadow-sm">
                        <SelectValue placeholder="Select an owner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingOwners ? (
                        <div className="flex items-center justify-center p-3">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      ) : owners.length > 0 ? (
                        owners.map((owner: any) => (
                          <SelectItem key={owner.id} value={owner.id.toString()}>
                            {owner.name} ({owner.email})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-center text-sm text-gray-500">
                          No store owners available. Create one in Users.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {owners.length === 0 && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Go to the Users section and create a user with the "Store Owner" role.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2 flex justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl px-6 shadow-md"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Store"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
