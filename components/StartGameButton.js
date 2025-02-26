"use client";

import { generateGames } from "@/app/utils/utils";
import { useRouter } from "next/navigation";

export default function StartGameButton() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/match");
  };

  const generateGamesAndRedirect = () => {
    localStorage.removeItem("games");

    generateGames();
    handleRedirect();
  };

  // TODO: disable button
  return (
    <button
      className="bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded"
      onClick={() => generateGamesAndRedirect()}
    >
      Start joc
    </button>
  );
}
