export default function PlayersListElement({
  playerName,
  playerId,
  removePlayer,
  index,
}) {
  return (
    <li
      className={`flex ${
        index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
      } justify-between px-2 h-10 items-center`}
    >
      <div>{playerName}</div>
      <button
        className="text-red-500"
        onClick={() => removePlayer(playerName, playerId)}
      >
        X
      </button>
    </li>
  );
}
