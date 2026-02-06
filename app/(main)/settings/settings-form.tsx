/**
 * Settings Form Component
 * 
 * Client component for profile settings form
 */

"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfile } from "../../../actions/users";
import { UploadButton } from "../../../lib/uploadthing";

interface SettingsFormProps {
  user: {
    id: string;
    name: string | null;
    username: string;
    email: string;
    image: string | null;
    bio: string | null;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(user.image);
  const [isUploading, setIsUploading] = useState(false);

  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      if (imageUrl !== user.image) {
        formData.set("image", imageUrl || "");
      }
      
      const result = await updateProfile(null, formData);
      
      if (result.success) {
        router.refresh();
      }
      
      return result;
    },
    null
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your account settings and profile</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your profile information visible to other users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar
                  src={imageUrl}
                  name={user.name}
                  size="xl"
                  className="h-24 w-24"
                />
                <div className="absolute -bottom-1 -right-1">
                  <UploadButton
                    endpoint="imageUploader"
                    onUploadBegin={() => setIsUploading(true)}
                    onClientUploadComplete={(res) => {
                      setIsUploading(false);
                      if (res?.[0]?.url) {
                        setImageUrl(res[0].url);
                      }
                    }}
                    onUploadError={(error) => {
                      setIsUploading(false);
                      alert(`Upload failed: ${error.message}`);
                    }}
                    appearance={{
                      button:
                        "h-8 w-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 p-0 flex items-center justify-center",
                      allowedContent: "hidden",
                    }}
                    content={{
                      button: isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      ),
                    }}
                  />
                </div>
              </div>
              <div>
                <p className="font-medium">Profile Photo</p>
                <p className="text-sm text-gray-500">
                  Click the camera icon to upload a new photo
                </p>
              </div>
            </div>

            {/* Name */}
            <Input
              name="name"
              label="Name"
              defaultValue={user.name || ""}
              placeholder="Your name"
              error={state?.errors?.name?.[0]}
            />

            {/* Username */}
            <Input
              name="username"
              label="Username"
              defaultValue={user.username}
              placeholder="username"
              error={state?.errors?.username?.[0]}
            />

            {/* Bio */}
            <Textarea
              name="bio"
              label="Bio"
              defaultValue={user.bio || ""}
              placeholder="Tell us about yourself..."
              className="min-h-[100px]"
              error={state?.errors?.bio?.[0]}
            />

            {/* Success/Error Messages */}
            {state?.success && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950 dark:text-green-400">
                {state.message}
              </div>
            )}

            {state && !state.success && state.message && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                {state.message}
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end">
              <Button type="submit" isLoading={isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Account ID
            </label>
            <p className="mt-1 font-mono text-sm text-gray-500">{user.id}</p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled>
            Delete Account
          </Button>
          <p className="mt-2 text-sm text-gray-500">
            Account deletion is not available yet
          </p>
        </CardContent>
      </Card>
    </div>
  );
}