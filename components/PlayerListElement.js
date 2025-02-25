export default function PlayersListElement({
  playerName,
  playerId,
  removePlayer,
  index,
}) {
  return (
    <li
      className={`flex ${
        index % 2 === 0 ? "bg-[#1e2021]" : "bg-[#2a2d2f]"
      } justify-between px-2 h-10 items-center w-80 rounded-xl`}
    >
      <div className="flex gap-3">
        <div># {index + 1}</div>
        <div>{playerName}</div>
      </div>
      <button
        className="text-red-500 hover:text-red-600"
        onClick={() => removePlayer(playerName, playerId)}
      >
        X
      </button>
    </li>
  );
}
