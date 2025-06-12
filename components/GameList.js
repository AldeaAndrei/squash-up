import GameListElement from "./GameListElement";
import LockIcon from "@mui/icons-material/Lock";
import CalculateEloButton from "./CalculateEloButton";
import { getById } from "@/app/api/tournaments/utils/getById";
import getPlayersById from "@/app/api/tournaments/utils/getPlayersById";
import getHistoryByTournamentId from "@/app/api/elo/utils/getHistoryByTournamentId";

export default async function GameList(params) {
  const tournament = await getById(params.tournamentId);
  const players = await getPlayersById(params.tournamentId);
  const eloHistory = await getHistoryByTournamentId(params.tournamentId);

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const isReadOnly = new Date(tournament.created_at) < oneDayAgo;

  const eloHash = {};
  eloHistory.forEach((eloData) => {
    eloHash[`${eloData.round_id}-${eloData.player_id}`] = eloData.elo;
  });

  return (
    <ul className="overflow-scroll-y flex flex-col gap-2 justify-center items-center">
      {isReadOnly && (
        <div className="flex flex-row items-start justify-start gap-5 p-2 mx-2 bg-red-300/15 border-red-300 border rounded-xl font-semibold">
          <LockIcon />
          <p>Turneul este mai vechi de 24h si nu poate fi modificat</p>
        </div>
      )}
      <div>
        {!isReadOnly && (
          <CalculateEloButton
            tournamentId={params.tournamentId}
            isDisabled={isReadOnly}
          />
        )}
      </div>
      {tournament?.games &&
        tournament.games.map((game, index) => {
          return (
            <ul
              key={`game-${index}`}
              className="overflow-scroll-y flex flex-col gap-2 justify-center items-center"
            >
              <div className="flex flex-row w-full justify-center items-center">
                <div className="flex-grow bg-white h-[1px] rounded-full" />
                <div className="px-2">Joc {index + 1}</div>
                <div className="flex-grow bg-white h-[1px] rounded-full" />
              </div>
              {game?.rounds &&
                game.rounds.map((round, index) => {
                  return (
                    <div key={`element-${index}`}>
                      <GameListElement
                        key={index}
                        round={round}
                        players={players}
                        eloHistory={eloHash}
                        player1ValuesProps={round.sets.map(
                          (set) => set.player_1_score
                        )}
                        player2ValuesProps={round.sets.map(
                          (set) => set.player_2_score
                        )}
                        isReadOnly={isReadOnly}
                      />
                    </div>
                  );
                })}
            </ul>
          );
        })}
    </ul>
  );
}
