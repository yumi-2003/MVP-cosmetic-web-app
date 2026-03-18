// pages/Register.tsx
import AuthLayout from "@/components/auth/AuthLayout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validators";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

type RegisterValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterValues) => {
    console.log(data);
  };

  return (
    <AuthLayout>
      {/* header  */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-serif text-foreground">Join With US!!!</h2>
        <p className="text-xs text-muted-foreground mt-2">
          Discover your radiance with exclusive member benefits
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* First + Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-foreground">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="given-name"
                      className="rounded-sm shadow-sm py-5 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-foreground">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="family-name"
                      className="rounded-sm shadow-sm py-5 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                    className="rounded-sm shadow-sm py-5 text-sm"
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
                      autoComplete="new-password"
                      className="rounded-sm shadow-sm py-5 text-sm pr-10"
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-semibold text-foreground">
                  Confirm Password
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="rounded-sm shadow-sm py-5 text-sm pr-10"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-2/3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Terms Checkbox */}
          <div className="flex items-start space-x-3 py-3">
            <Checkbox
              id="terms"
              className="mt-1 h-4 w-4 border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor="terms"
              className="text-xs text-muted-foreground leading-relaxed"
            >
              I agree to the{" "}
              <Link
                to="/terms"
                className="underline font-medium hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="underline font-medium hover:text-primary"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button className="w-full tracking-widest text-sm py-6 rounded-sm mt-4">
            CREATE ACCOUNT &rarr;
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm mt-8 mb-2 text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>

      {/* divider  */}
      <div className="flex items-center gap-3 my-8">
        <div className="flex-1 h-px bg-border"></div>
        <span className="text-xs text-muted-foreground uppercase tracking-widest px-2">
          OR
        </span>
        <div className="flex-1 h-px bg-border"></div>
      </div>

      {/* social links  */}
      <div className="space-y-3">
        <button className="w-full bg-background border border-border py-3.5 rounded-sm hover:bg-muted flex items-center justify-center gap-3 text-sm font-medium text-foreground transition-colors shadow-sm">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-4 h-4"
          />
          Continue with Google
        </button>
        <button className="w-full bg-background border border-border py-3.5 rounded-sm hover:bg-muted flex items-center justify-center gap-3 text-sm font-medium text-foreground transition-colors shadow-sm">
          <img
            src="https://www.svgrepo.com/show/475647/facebook-color.svg"
            alt="Facebook"
            className="w-4 h-4"
          />
          Continue with Facebook
        </button>
      </div>
    </AuthLayout>
  );
}
