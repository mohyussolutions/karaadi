"use client";
import { apiService } from "@/actions/core/authAction";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface User {
  profileImage?: string;
  phone?: string;
}

interface ProfileEditFormProps {
  user?: User;
  onSave: (updatedUser: {
    profileImage?: string;
    phone?: string;
    profileImageFile?: File | null;
  }) => void;
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImageFile(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const session = await apiService.verifySession();
      if (!session?.accessToken) {
        throw new Error("Authentication required");
      }

      const updatedUser = await apiService.updateProfile(
        {
          phone,
          profileImageFile,
        },
        session.accessToken
      );

      onSave({
        phone: updatedUser.phone,
        profileImage: updatedUser.profileImage,
        profileImageFile: null,
      });
    } catch (error) {
      console.error("Profile update failed", error);
      alert(
        error instanceof Error ? error.message : "Failed to update profile"
      );
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
                alt="Profile Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400 font-semibold select-none">
                No Image
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="profileImageInput"
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition select-none"
            >
              {previewImage ? "Change Photo" : "Upload Photo"}
            </label>
            {previewImage && (
              <button
                type="button"
                onClick={() => {
                  setProfileImageFile(null);
                  setPreviewImage("");
                }}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Remove Photo
              </button>
            )}
          </div>
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
            placeholder="Enter your phone number"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            disabled={!phone && !profileImageFile}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;
