"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileCard from "./ProfileCard";
import { verifySession } from "@/actions/core/authAction";
import AccountOptionsClient from "./AccountOptionsClient";

export default async function MyAccountCards() {
  const cookieStore = await cookies();
  const accessToken =
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("idToken")?.value ||
    "";

  const user = await verifySession(accessToken);

  if (!user) redirect("/");

  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const headerHeaders = await headers();
  const headerLocale = headerHeaders
    .get("accept-language")
    ?.split(",")[0]
    ?.split("-")[0];
  const locale = (cookieLocale || headerLocale || "en").toLowerCase();

  return (
    <>
      <ProfileCard user={user} accessToken={accessToken} />
      <AccountOptionsClient user={user} />
    </>
  );
}
