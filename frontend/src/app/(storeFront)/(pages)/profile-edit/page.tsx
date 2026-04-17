"use client";
export const dynamic = "force-dynamic";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/actions/core/accountAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

const ProfileEditPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (user?.profileImage) {
      const isBase64 =
        /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(
          user.profileImage,
        );
      const src =
        isBase64 && !user.profileImage.startsWith("data:")
          ? `data:image/jpeg;base64,${user.profileImage}`
          : user.profileImage;
      setPreviewImage(src);
    }
  }, [user]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setImageError(false);
    }
  };

  const getValidImageSrc = () =>
    imageError || !previewImage ? "/default-profile.png" : previewImage;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const token = user.accessToken || user.token;
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const formData = new FormData();
      if (profileImageFile) formData.append("profileImage", profileImageFile);

      const result = await updateProfile(formData, token);
      if (result.success) {
        toast.success("Profile updated");
        router.push("/mine");
        router.refresh();
      } else {
        toast.error((result as any).error || "Update failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  if (!user) return null;

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50/50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Edit Profile Image
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-blue-50 bg-gray-100">
                  {previewImage ? (
                    <Image
                      src={getValidImageSrc()}
                      alt="Profile"
                      fill
                      className="object-cover"
                      sizes="112px"
                      onError={() => setImageError(true)}
                      unoptimized={
                        previewImage.startsWith("data:") ||
                        previewImage.startsWith("blob:")
                      }
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400 text-xs font-medium uppercase">
                        No image
                      </span>
                    </div>
                  )}
                </div>
                <input
                  id="imgInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="imgInput"
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  {previewImage ? "Change Photo" : "Upload Photo"}
                </label>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !profileImageFile}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg disabled:bg-gray-300"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
