"use client";

import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { green } from "@mui/material/colors";
import { useRouter } from "next/navigation";

export default function ViewTournamentButton({ tournamentId }) {
  const [isClient, setIsClient] = useState(false);
  const [routerReady, setRouterReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    if (router) {
      setRouterReady(true);
    }
  }, [router]);

  if (!isClient || !routerReady) return null;

  return (
    <button
      className="bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 max-w-10 border border-[#292929] rounded flex justify-center items-center"
      onClick={() => router.push(`/tournament/${tournamentId}`)}
    >
      <VisibilityIcon sx={{ color: green[500] }} />
    </button>
  );
}
