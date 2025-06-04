import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation } from "wouter";
import { validateUserSchema, loginSchema } from "@shared/validation";
import { UserRole } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof validateUserSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(validateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      password: "",
      role: UserRole.USER,
    },
  });

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <Card className="w-full max-w-lg shadow-2xl rounded-xl border border-gray-200 bg-white">
          <CardHeader className="pb-4 border-b border-gray-200">
            <CardTitle className="text-3xl font-extrabold text-center text-purple-700">
              Store Rating Platform
            </CardTitle>
            <CardDescription className="text-center text-gray-600 mt-1">
              Sign in or create your account to start rating stores
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 gap-2 bg-purple-50 rounded-lg p-1 shadow-inner">
                <TabsTrigger
                  value="login"
                  className="text-purple-700 font-semibold hover:bg-purple-100 rounded-md"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="text-purple-700 font-semibold hover:bg-purple-100 rounded-md"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="mt-6">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-gray-700">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="you@example.com"
                              type="email"
                              {...field}
                              className="rounded-md border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-gray-700">Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your password"
                              type="password"
                              {...field}
                              className="rounded-md border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md rounded-md flex justify-center items-center gap-2"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" /> Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="mt-6">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-gray-700">Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              className="rounded-md border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-gray-700">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="you@example.com"
                              type="email"
                              {...field}
                              className="rounded-md border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-gray-700">Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your address"
                              {...field}
                              className="rounded-md border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-gray-700">Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Create a password"
                              type="password"
                              {...field}
                              className="rounded-md border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md rounded-md flex justify-center items-center gap-2"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" /> Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t border-gray-200">
            <p className="text-xs text-center text-gray-500 w-full select-none">
              By continuing, you agree to our{" "}
              <a href="#" className="underline hover:text-purple-600">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-purple-600">
                Privacy Policy
              </a>
              .
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Right Side - Hero Section */}
      <div className="flex-1 hidden md:flex flex-col justify-center p-16 bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 text-white rounded-l-3xl shadow-lg">
        <h1 className="text-5xl font-extrabold leading-tight max-w-lg mb-8 drop-shadow-lg">
          Rate Smarter. Discover Better.
        </h1>
        <p className="text-lg max-w-md mb-12 drop-shadow-md">
          Join thousands of users sharing authentic store reviews. Help build trust,
          support your local businesses, and find the best places around you—all in one app.
        </p>

        <div className="grid grid-cols-2 gap-8 max-w-md">
          {[
            {
              title: "Find Top Stores",
              desc: "Explore trending and top-rated stores near your location.",
            },
            {
              title: "Write Reviews",
              desc: "Share your feedback to help others shop smarter.",
            },
            {
              title: "Store Dashboard",
              desc: "Business owners can manage and monitor store ratings.",
            },
            {
              title: "Admin Tools",
              desc: "Admins can ensure platform integrity and user safety.",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg hover:bg-white/30 transition cursor-default"
            >
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
