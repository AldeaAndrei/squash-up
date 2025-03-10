"use client";

import { useRouter } from "next/navigation";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { addGameToTournament } from "@/app/utils/utils";

export default function AddRoundButton() {
  const router = useRouter();

  const addRoundAndRefresh = async () => {
    addGameToTournament().then((res) => {
      const { id, error } = res;

      if (error) return;

      router.push(`/tournament/${id}`);
      window.location.reload();
    });
  };

  return (
    <button
      className="bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded"
      onClick={() => addRoundAndRefresh()}
    >
      <div className="flex flex-row justify-center items-center">
        <AddCircleOutlineIcon />
        <span className="ml-1">Joc</span>
      </div>
    </button>
  );
}
