"use client";

import { useRouter } from "next/navigation";

import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CachedIcon from "@mui/icons-material/Cached";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";

export default function NavigationButton({ path, text, noIcon }) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(path);
  };

  const selectIcon = () => {
    if (path === "/leaderboard") return <LeaderboardIcon />;
    if (path === "/start") return <CachedIcon />;
    if (path === "/match") return <ScoreboardIcon />;
  };

  return (
    <button
      className={`bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded`}
      onClick={() => handleRedirect()}
    >
      <div className="flex flex-row justify-center items-center">
        {!noIcon && selectIcon()}
        {text && <span className="ml-1">{text}</span>}
      </div>
    </button>
  );
}
