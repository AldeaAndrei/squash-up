"use client";

import { useAuthStore } from "@/app/store/authStore";
import { generateNewTournament } from "@/app/utils/utils";
import { useRouter } from "next/navigation";

export default function StartGameButton() {
  const router = useRouter();
  const { player } = useAuthStore();

  const handleRedirect = (id) => {
    router.push(`/tournament/${id}`);
  };

  const generateGamesAndRedirect = () => {
    generateNewTournament(player).then((res) => {
      console.log(res);
      if (res.id) handleRedirect(res.id);
    });
  };

  return (
    <button
      className="bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded"
      onClick={() => generateGamesAndRedirect()}
    >
      Start joc
    </button>
  );
}
