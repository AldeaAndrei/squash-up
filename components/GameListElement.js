import { useEffect, useState } from "react";

export default function GameListElement({ game, setScores, index }) {
  const [inputValue1, setInputValue1] = useState(game.player1Score);
  const [inputValue2, setInputValue2] = useState(game.player2Score);

  const handleSubmit = () => {
    if (!isNaN(inputValue1)) setInputValue1(inputValue1);
    if (!isNaN(inputValue2)) setInputValue2(inputValue2);

    setScores(game.player1Name, inputValue1, game.player2Name, inputValue2);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  useEffect(() => {
    handleSubmit();
  }, [inputValue1, inputValue2]);

  return (
    <li
      className={`${
        index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
      } justify-between px-2 py-1 items-center rounded-xl`}
    >
      <div className=" justify-center items-center flex-1 gap-3">
        <div className="flex items-center justify-between px-10">
          <div>{game.player1Name}</div>
          <input
            type="number"
            value={inputValue1}
            onChange={(e) => setInputValue1(e.target.value)}
            onKeyDown={handleKeyPress} // Calls function when Enter is pressed
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-14 flex justify-center items-center"
          />
        </div>
        <div className="flex items-center justify-between px-10">
          <div>{game.player2Name}</div>
          <input
            type="number"
            value={inputValue2}
            onChange={(e) => setInputValue2(e.target.value)}
            onKeyDown={handleKeyPress} // Calls function when Enter is pressed
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-14 flex justify-center items-center"
          />
        </div>
      </div>
    </li>
  );
}
