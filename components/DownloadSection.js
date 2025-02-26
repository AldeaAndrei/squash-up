"use client";

import { useEffect, useState } from "react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

export default function DownloadSection() {
  const [gameString, setGameStrig] = useState("");
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  useEffect(() => {
    const storedGames = localStorage.getItem("games");
    if (storedGames) {
      try {
        setGameStrig(storedGames);
      } catch (error) {
        setGameStrig("No games");
      }
    }
  }, []);

  return (
    <section className="mt-2 flex flex-row justify-start items-center gap-2">
      <button
        className="bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded h-15"
        onClick={() => setIsDownloadOpen(!isDownloadOpen)}
      >
        <CloudDownloadIcon />
      </button>
      {isDownloadOpen && (
        <textarea
          value={gameString}
          readOnly
          onClick={(e) => {
            navigator.clipboard.writeText(gameString);
            e.target.select();
          }}
          className="w-full h-15 bg-transparent border border-[#292929] rounded cursor-default"
        />
      )}
    </section>
  );
}

{
  /* <button
className={`bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded`}
onClick={() => handleRedirect()}
> */
}
