import { useEffect, useState } from "react";

export function useProfileImage(userId?: string) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || userId === "") {
      setProfileImage(null);
      setError(null);
      return;
    }
    setLoading(true);
    fetch("/api/users/profile/image", {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 404) {
          setProfileImage(null);
          setError(null);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch profile image");
        const data = await res.json();
        setProfileImage(data.profileImage || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  return { profileImage, loading, error };
}
