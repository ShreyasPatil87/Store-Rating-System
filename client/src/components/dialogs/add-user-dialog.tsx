import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateUserSchema } from "@shared/validation";
import { z } from "zod";
import { UserRole } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
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

type FormData = z.infer<typeof validateUserSchema>;

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole?: UserRole;
}

export function AddUserDialog({
  open,
  onOpenChange,
  defaultRole = UserRole.USER,
}: AddUserDialogProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(validateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      password: "",
      role: defaultRole,
    },
  });

  useEffect(() => {
    if (defaultRole) {
      form.setValue("role", defaultRole);
    }
  }, [defaultRole, form]);

  const addUserMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/admin/users", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/statistics"] });
      toast({
        title: "User created",
        description: "The user has been created successfully.",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create user",
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
    addUserMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl shadow-xl border border-gray-200">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-bold text-primary">
            {defaultRole === UserRole.OWNER ? "Add Store Owner" : "Add New User"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {defaultRole === UserRole.OWNER
              ? "Create a new store owner. You'll be able to assign them a store afterward."
              : "Fill in the details below to create a new user in the system."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-sm text-gray-700">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Full Name"
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
                      placeholder="user@example.com"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-sm text-gray-700">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Minimum 6 characters"
                      type="password"
                      className="rounded-xl shadow-sm"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500">Password should be strong.</p>
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
                      placeholder="Enter user address"
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-sm text-gray-700">User Role</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value as UserRole)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl shadow-sm">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.USER}>User</SelectItem>
                      <SelectItem value={UserRole.OWNER}>Store Owner</SelectItem>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    </SelectContent>
                  </Select>
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
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
