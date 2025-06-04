import { useAuth } from "@/hooks/use-auth";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@shared/validation";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function UserProfile() {
  const { user, changePasswordMutation } = useAuth();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="py-10 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
          My Profile
        </h2>

        <Card className="shadow-lg rounded-lg border border-gray-200 overflow-hidden">
          <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4">
            <h3 className="text-xl font-semibold text-indigo-700">
              Personal Information
            </h3>
            <p className="text-sm text-indigo-500 mt-1">
              Your account details.
            </p>
          </CardHeader>
          <CardContent className="px-6 py-6 bg-white">
            <dl className="divide-y divide-gray-100">
              {[ 
                { label: "Full name", value: user.name },
                { label: "Email address", value: user.email },
                { label: "Address", value: user.address },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="py-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:py-5"
                >
                  <dt className="text-sm font-medium text-gray-600">{label}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {value || (
                      <span className="italic text-gray-400">Not provided</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg border border-gray-200 overflow-hidden mt-10">
          <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-pink-50 to-red-50 px-6 py-4">
            <h3 className="text-xl font-semibold text-red-600">
              Change Password
            </h3>
            <p className="text-sm text-red-500 mt-1">
              Update your account password.
            </p>
          </CardHeader>
          <CardContent className="px-6 py-6 bg-white">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700">
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your current password"
                          {...field}
                          className="border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-600 mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your new password"
                          {...field}
                          className="border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                        />
                      </FormControl>
                      <p className="mt-1 text-xs text-pink-600 font-medium">
                        8-16 characters, including at least one uppercase letter and
                        one special character.
                      </p>
                      <FormMessage className="text-sm text-red-600 mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your new password"
                          {...field}
                          className="border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-600 mt-1" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="w-full bg-pink-600 hover:bg-pink-700 active:bg-pink-800 focus:ring-pink-500 text-white font-semibold py-3 rounded-lg shadow-md transition-all"
                >
                  {changePasswordMutation.isPending ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
