"use client";

import React, { useEffect, useState } from "react";
import Loading from "../../components/shared/Loading/Loading";
import { getProfile } from "@/actions/core/accountAction";

interface IUser {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
}

function Karaadi() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await getProfile("");
        if (profile && !profile.error) {
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (!user)
    return (
      <p className="text-center mt-6">
        Wax macluumaad ah laguma helin akoonkaaga.
      </p>
    );

  return (
    <div className="container mx-auto max-w-4xl p-8 space-y-6">
      <h1 className="text-3xl font-bold">KARAADI Ganacsiyada</h1>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Waxaad ku gashay sida</h2>
        <div className="flex items-center space-x-4 mt-2">
          {user.profileImage && (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <p>
              <strong>Magaca:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-red-100 p-4 rounded-lg">
        <h3 className="font-semibold">
          Haddii aad hore u tahay macmiil ganacsi
        </h3>
        <p>
          La xiriir saaxiib ama maamulka ganacsigaaga si ay akoonkaaga ugu
          darayaan Bedrift-senter. Ama la xiriir xiriirkaaga FINN si aad u hesho
          caawimaad.
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-2">Ganacsiyada aad heli karto</h2>
        <p>Ma haysatid wax ganacsi oo ku xiran akoonkaaga Vend.</p>
      </div>
    </div>
  );
}

export default Karaadi;
