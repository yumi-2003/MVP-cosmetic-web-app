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
        <h2 className="text-xl font-serif text-foreground">Welcome back</h2>
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
                <FormLabel className="text-sm font-semibold text-foreground">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    className="rounded-lg border-border/50 focus:border-primary/50 focus:ring-primary/20 shadow-sm py-6 text-sm transition-all"
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
                <FormLabel className="text-sm font-semibold text-foreground">
                  Password
                </FormLabel>

                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="rounded-lg border-border/50 focus:border-primary/50 focus:ring-primary/20 shadow-sm py-6 text-sm pr-10 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-2/3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="flex justify-end mt-1 pb-1">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-primary hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Button */}
          <Button className="w-full tracking-[0.2em] text-[11px] font-bold py-7 rounded-lg mt-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-300">
            SIGN IN &rarr;
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm mt-8 mb-2 text-muted-foreground">
        New to JUSTAGIRL?{" "}
        <Link
          to="/signup"
          className="text-primary font-medium hover:underline"
        >
          Create an account
        </Link>
      </p>

      {/* divider  */}
      <div className="flex items-center gap-4 my-10">
        <div className="flex-1 h-[0.5px] bg-border/60"></div>
        <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] px-2 font-medium">
          OR
        </span>
        <div className="flex-1 h-[0.5px] bg-border/60"></div>
      </div>

      {/* social links  */}
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-3 bg-background border border-border/50 py-3 rounded-md hover:bg-muted/50 hover:border-primary/20 transition-all duration-300 shadow-sm active:scale-95">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-4 h-4"
          />
          <span className="text-xs font-semibold text-foreground/80">Google</span>
        </button>
        <button className="flex items-center justify-center gap-3 bg-background border border-border/50 py-3 rounded-md hover:bg-muted/50 hover:border-primary/20 transition-all duration-300 shadow-sm active:scale-95">
          <img
            src="https://www.svgrepo.com/show/475647/facebook-color.svg"
            alt="Facebook"
            className="w-4 h-4"
          />
          <span className="text-xs font-semibold text-foreground/80">Facebook</span>
        </button>
      </div>
    </AuthLayout>
  );
};

export default Login;
