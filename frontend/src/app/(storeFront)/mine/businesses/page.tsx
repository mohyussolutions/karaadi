"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../../components/shared/Loading/Loading";
import { verifySession } from "@/actions/core/authAction";

interface IUser {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  phone?: string;
  isAdmin?: boolean;
}

function Karaadi() {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(";").shift();
          return null;
        };

        const token = getCookie("accessToken") || getCookie("idToken");
        const profile = await verifySession(token || undefined);

        if (profile) {
          setUser(profile as IUser);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleJoinBusiness = () => {
    router.push("/business-customer");
  };

  if (loading) return;
  <div className="flex items-center justify-center min-h-[400px] w-full">
    <Loading />
  </div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center mt-10 p-4">
        <p className="text-red-500 font-medium">
          Ma aynaan helin macluumaadka akoonkaaga.
        </p>
        <p className="text-gray-500 text-sm">
          Fadlan hubi inaad si sax ah u soo gashay nidaamka.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-8 space-y-10">
      <section>
        <h1 className="text-3xl font-bold mb-4">
          Ma jiro ganacsi ku xiran akoonkan
        </h1>
        <p className="text-gray-700 leading-relaxed">
          Akoonkaagu weli kuma xirnayn ganacsi. La xiriir maamulaha akoonkaaga
          si aad u hesho marin aad ku gasho Xarunta Ganacsiga.
        </p>
      </section>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-600">
          Xogta Isticmaalaha:
        </h2>
        <div className="flex items-center space-x-4">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.username}
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
              {user.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-bold text-xl">{user.username}</p>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">ID: {user._id}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-6 bg-red-50 rounded-xl border border-red-100">
          <h3 className="font-bold text-red-700 text-lg">
            Haddii aad tahay macmiil ganacsi
          </h3>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            La xiriir saaxiibkaaga shaqada ee leh xuquuqda maamulka (admin) ee
            ganacsigaaga si uu kuu ugu daro akoonkan.
          </p>
        </div>

        <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-bold text-blue-700 text-lg">
            Noqo macmiil ganacsi
          </h3>
          <p className="text-sm text-gray-600 mt-2 mb-4">
            Abuur profile-kaaga ganacsiga si aad u bilowdo xayeysiinta.
          </p>
          <button
            onClick={handleJoinBusiness}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            Hadda bilow
          </button>
        </div>
      </div>
    </div>
  );
}

export default Karaadi;
