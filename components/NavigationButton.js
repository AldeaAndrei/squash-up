"use client";

import { useRouter, usePathname } from "next/navigation";

import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CachedIcon from "@mui/icons-material/Cached";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import HistoryIcon from "@mui/icons-material/ManageSearch";

export default function NavigationButton({
  path,
  text,
  noText,
  noIcon,
  width,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleRedirect = () => {
    router.push(path);
  };

  const selectIcon = () => {
    if (path.startsWith("/leaderboard")) return <LeaderboardIcon />;
    if (path.startsWith("/start")) return <CachedIcon />;
    if (path.startsWith("/tournament")) return <ScoreboardIcon />;
    if (path.startsWith("/history")) return <HistoryIcon />;
  };

  return (
    <button
      className={`bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded w-[${width}px] disabled:bg-[#3f4240]`}
      onClick={() => handleRedirect()}
      disabled={pathname.startsWith(path)}
    >
      <div className="flex flex-row justify-center items-center">
        {!noIcon && selectIcon()}
        {!noText && text && <span className="ml-1">{text}</span>}
      </div>
      {pathname.startsWith(path) && <div className="w-full h-[1px] bg-white" />}
    </button>
  );
}
