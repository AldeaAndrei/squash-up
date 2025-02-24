"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/start");
  };

  useEffect(() => handleRedirect(), []);

  return <></>;
}
