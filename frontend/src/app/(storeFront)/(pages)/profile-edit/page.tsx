"use client";

import { updateProfile, verifySession } from "@/actions/core/authAction";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";

interface User {
  profileImage?: string;
  phone?: string;
}

interface ProfileEditFormProps {
  user?: User;
  onSave: (updatedUser: any) => void;
  onCancel: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  user = {},
  onSave,
  onCancel,
}) => {
  const [phone, setPhone] = useState(user.phone || "");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(user.profileImage || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.phone) setPhone(user.phone);
    if (user.profileImage) setPreviewImage(user.profileImage);
  }, [user]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProfileImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const session = await verifySession();

      const token = session?.accessToken || session?.token;

      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const result = await updateProfile(
        {
          phone,
          profileImageFile,
        },
        token,
      );

      onSave(result);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-md p-8 space-y-6"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-gray-100 border-2 border-gray-300 relative">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No Image
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
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {previewImage ? "Change Photo" : "Upload Photo"}
          </label>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2"
            placeholder="Enter phone number"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || (!phone && !profileImageFile)}
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;
