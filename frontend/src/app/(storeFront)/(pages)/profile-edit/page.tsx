"use client";

import { updateProfile, verifySession } from "@/actions/core/authAction";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

interface User {
  profileImage?: string;
  email?: string;
}

const ProfileEditPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [originalImage, setOriginalImage] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      const session = await verifySession();
      if (session) {
        setEmail(session.email || "");

        if (session.profileImage) {
          if (
            session.profileImage.startsWith("/9j/") ||
            session.profileImage.startsWith("iVB")
          ) {
            setPreviewImage(`data:image/jpeg;base64,${session.profileImage}`);
          } else {
            setPreviewImage(session.profileImage);
          }
          setOriginalImage(session.profileImage);
        }
      }
    };
    loadUserData();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setImageError(false);
    }
  };

  const getValidImageSrc = () => {
    if (imageError || !previewImage) {
      return "/default-profile.png";
    }
    return previewImage;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const session = await verifySession();
      const token = session?.accessToken || session?.token;

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const formData = new FormData();
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const result = await updateProfile(formData, token);

      if (result.success) {
        toast.success("Profile image updated successfully");
        router.push("/mine");
      } else {
        toast.error(result.error || "Update failed");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Edit Profile Image
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-blue-100">
                  {previewImage ? (
                    <Image
                      src={getValidImageSrc()}
                      alt="Profile"
                      fill
                      className="object-cover"
                      sizes="112px"
                      onError={() => setImageError(true)}
                      unoptimized={previewImage.startsWith("data:")}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>

                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="profileImageInput"
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                  {previewImage ? "Change Photo" : "Upload Photo"}
                </label>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !profileImageFile}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition shadow-sm"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
