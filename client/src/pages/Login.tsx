import AuthLayout from "@/components/auth/AuthLayout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validators";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

type LoginValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginValues) => {
    console.log(data); //later api
  };

  return (
    <AuthLayout>
      {/* header  */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-serif text-[#2c2a29]">Welcome back</h2>
        <p className="text-xs text-muted-foreground mt-2">
          Sign in to your account to continue your beauty journey
        </p>
      </div>
      
      {/* form  */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-semibold text-gray-700">Email Address</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    autoComplete="email" 
                    className="rounded-sm border-gray-300 focus-visible:ring-[#824f5a] shadow-sm py-5 text-sm"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-semibold text-gray-700">Password</FormLabel>

                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="rounded-sm border-gray-300 focus-visible:ring-[#824f5a] shadow-sm py-5 text-sm pr-10"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                
                <div className="flex justify-end mt-1 pb-1">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-[#824f5a] hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Button */}
          <Button className="w-full bg-[#824f5a] hover:bg-[#6e414b] text-white tracking-widest text-sm py-6 rounded-sm mt-4 transition-colors">
            SIGN IN &rarr;
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm mt-8 mb-2 text-muted-foreground">
        New to JUSTAGIRL? <Link to="/signup" className="text-[#824f5a] font-medium hover:underline">Create an account</Link>
      </p>

      {/* divider  */}
      <div className="flex items-center gap-3 my-8">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-xs text-muted-foreground uppercase tracking-widest px-2">OR</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* social links  */}
      <div className="space-y-3">
        <button className="w-full bg-white border border-gray-200 py-3.5 rounded-sm hover:bg-gray-50 flex items-center justify-center gap-3 text-sm font-medium text-gray-700 transition-colors shadow-sm">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
          Continue with Google
        </button>
        <button className="w-full bg-white border border-gray-200 py-3.5 rounded-sm hover:bg-gray-50 flex items-center justify-center gap-3 text-sm font-medium text-gray-700 transition-colors shadow-sm">
          <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-4 h-4" />
          Continue with GitHub
        </button>
      </div>
    </AuthLayout>
  );
};

export default Login;
