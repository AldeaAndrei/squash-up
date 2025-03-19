"use client";

import { usePathname } from "next/navigation";
import AddRoundButton from "./AddRoundButton";
import NavigationButton from "./NavigationButton";
import NewGameButton from "./NewGameButton";
import SetGameTypeButton from "./SetGameTypeButton";
import StartGameButton from "./StartGameButton";

export default function NavBar({ tournamentId }) {
  const pathname = usePathname();

  const canShowHistory = true;
  const canShowGameType = pathname.startsWith("/start");
  const canShowStartGame = pathname.startsWith("/start");
  const canShowNewGame = !pathname.startsWith("/start");
  const canShowAddRound = pathname.startsWith("/tournament");
  const canShowScores =
    !pathname.startsWith("/history") && !pathname.startsWith("/start");
  const canShowLeaderboard =
    !pathname.startsWith("/history") && !pathname.startsWith("/start");

  const canShowHistoryText =
    pathname.startsWith("/history") || pathname.startsWith("/start");
  const canShowNewGameText = pathname.startsWith("/history");

  return (
    <nav className="flex gap-2 justify-center items-center text-sm">
      {canShowHistory && (
        <NavigationButton
          path={`/history`}
          text="Istoric"
          noText={!canShowHistoryText}
        />
      )}
      {canShowGameType && <SetGameTypeButton />}
      {canShowStartGame && <StartGameButton />}
      {canShowNewGame && <NewGameButton noText={!canShowNewGameText} />}
      {canShowAddRound && (
        <AddRoundButton tournamentId={tournamentId} noText={true} />
      )}
      {canShowScores && (
        <NavigationButton
          path={`/tournament/${tournamentId}`}
          text="Scoruri"
          noText={true}
        />
      )}
      {canShowLeaderboard && (
        <NavigationButton
          path={`/leaderboard/${tournamentId}`}
          text="Clasament"
          noText={true}
        />
      )}
    </nav>
  );
}
