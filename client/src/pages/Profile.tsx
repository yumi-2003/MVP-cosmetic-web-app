import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/validators";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateProfile, clearError } from "@/redux/slices/authSlice";
import { toast } from "sonner";
import { Loader2, User, Mail, Save, Camera } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { z } from "zod";

type ProfileValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.auth);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.profileImage || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstname || "",
      lastName: user?.lastname || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
      });
      setImagePreview(user.profileImage || null);
    }
  }, [user, form]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileValues) => {
    const formData = new FormData();
    formData.append("firstname", data.firstName);
    formData.append("lastname", data.lastName);
    formData.append("email", data.email);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    const resultAction = await dispatch(updateProfile(formData));
    if (updateProfile.fulfilled.match(resultAction)) {
      toast.success("Profile updated successfully!");
      setSelectedFile(null);
    }
  };

  const isLoading = status === "loading";
  const userInitials = user
    ? `${user.firstname[0]}${user.lastname[0]}`.toUpperCase()
    : "";

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 bg-accent/5">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-serif tracking-tight text-foreground">Account Settings</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-[0.2em]">
            Personalize your experience
          </p>
        </div>

        <Card className="border-border/40 shadow-xl bg-background/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-serif">Your Profile</CardTitle>
            <CardDescription>
              Keep your information up to date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                  <div className="relative group">
                    <Avatar className="w-32 h-32 border-4 border-background shadow-lg transition-transform duration-300 group-hover:scale-105">
                      <AvatarImage src={imagePreview || ""} alt={user?.firstname} className="object-cover" />
                      <AvatarFallback className="text-2xl font-serif bg-primary/10 text-primary">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
                      title="Update photo"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    JPEG or PNG. Max 2MB.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-foreground/70">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Jane"
                            className="rounded-xl py-7 bg-background/50 border-border/50 focus:ring-primary/20 transition-all"
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
                      <FormItem className="space-y-3">
                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-foreground/70">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            className="rounded-xl py-7 bg-background/50 border-border/50 focus:ring-primary/20 transition-all"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-foreground/70">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="jane.doe@example.com"
                          className="rounded-xl py-7 bg-background/50 border-border/50 focus:ring-primary/20 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-6 flex justify-center">
                  <Button
                    type="submit"
                    disabled={isLoading || (!form.formState.isDirty && !selectedFile)}
                    className="px-12 py-7 rounded-xl tracking-[0.2em] font-bold text-[11px] uppercase shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        PREPARING...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        SAVE CHANGES
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
