"use client";

import { SITE_NAME } from "@/constants";
import { useRouter } from "next/navigation";

export default function SiteNameButton() {
  const router = useRouter();
  return <h1 onClick={() => router.push("/start")}>{SITE_NAME}</h1>;
}
