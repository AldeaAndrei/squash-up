"use client";

import { generateGames } from "@/app/utils/utils";
import { useRouter } from "next/navigation";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function AddRoundButton() {
  const router = useRouter();

  const addRoundAndRefresh = () => {
    generateGames();

    router.push("/match");
    window.location.reload();
  };

  return (
    <button
      className="bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded"
      onClick={() => addRoundAndRefresh()}
    >
      <div className="flex flex-row justify-center items-center">
        <AddCircleOutlineIcon />
        <span className="ml-1">Runda</span>
      </div>
    </button>
  );
}
