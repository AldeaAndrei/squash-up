"use client";

import { useAuthStore } from "@/app/store/authStore";
import { generateNewTournament } from "@/app/utils/utils";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function StartGameButton() {
  const router = useRouter();
  const { player } = useAuthStore();

  const handleRedirect = (id) => {
    router.push(`/tournament/${id}`);
  };

  const generateGamesAndRedirect = () => {
    generateNewTournament(player).then((res) => {
      if (res.id) handleRedirect(res.id);
    });
  };

  return (
    <Button
      variant="outline"
      className="bg-green-400 dark:bg-green-800"
      onClick={() => generateGamesAndRedirect()}
    >
      Start tournament
    </Button>
  );
}
