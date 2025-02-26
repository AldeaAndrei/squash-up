import { useEffect, useRef, useState } from "react";

export default function matchListElement({ match, setScores, round }) {
  const [inputValue1, setInputValue1] = useState(match.player1Score);
  const [inputValue2, setInputValue2] = useState(match.player2Score);
  const [inputValue1Color, setInputValue1Color] = useState(
    match.player1Score > match.player2Score
      ? "text-[#84c542]"
      : "text-[#c54242]"
  );
  const [inputValue2Color, setInputValue2Color] = useState(
    match.player2Score > match.player1Score
      ? "text-[#84c542]"
      : "text-[#c54242]"
  );
  const prevValues = useRef({ inputValue1, inputValue2 });

  const validatedScore = (val) => {
    let score = parseInt(val, 10);
    if (isNaN(score)) return 0;
    return Math.max(0, Math.min(25, score));
  };

  const handleSubmit = () => {
    const newScore1 = validatedScore(inputValue1);
    const newScore2 = validatedScore(inputValue2);

    setInputValue1Color(
      newScore1 > newScore2 ? "text-[#84c542]" : "text-[#c54242]"
    );
    setInputValue2Color(
      newScore2 > newScore1 ? "text-[#84c542]" : "text-[#c54242]"
    );

    setInputValue1(newScore1);
    setInputValue2(newScore2);

    setScores(
      match.player1Name,
      newScore1,
      match.player2Name,
      newScore2,
      round
    );
  };

  useEffect(() => {
    const prevScore1 = prevValues.current.inputValue1;
    const prevScore2 = prevValues.current.inputValue2;

    if (prevScore1 !== inputValue1 || prevScore2 !== inputValue2) {
      handleSubmit();
      prevValues.current = { inputValue1, inputValue2 };
    }
  }, [inputValue1, inputValue2]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (
      prevValues.current.inputValue1 !== inputValue1 ||
      prevValues.current.inputValue2 !== inputValue2
    ) {
      handleSubmit();
      prevValues.current = { inputValue1, inputValue2 };
    }
  }, [inputValue1, inputValue2]);

  return (
    <li className="bg-[#1e2021] justify-between px-2 py-1 items-center rounded-xl w-80">
      <div className=" justify-center items-center flex-1 gap-3">
        <div className="flex items-center justify-between px-10">
          <div>{match.player1Name}</div>
          <input
            type="number"
            value={inputValue1}
            onChange={(e) => setInputValue1(e.target.value)}
            onKeyDown={handleKeyPress}
            className={`${
              parseInt(inputValue1) === 0 ? "text-[#e7e8e9]" : inputValue1Color
            } text-center bg-transparent px-2 py-1 rounded-lg focus:outline-none focus:underline w-14 flex justify-center items-center`}
          />
        </div>
        <div className="flex justify-center items-center">
          <div className="text-center align-middle mr-3 text-gray-500 text-xs">
            vs
          </div>
          <div className="bg-[#2a2d2e] w-[80%] mr-3 h-1 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-10">
          <div>{match.player2Name}</div>
          <input
            type="number"
            value={inputValue2}
            onChange={(e) => setInputValue2(e.target.value)}
            onKeyDown={handleKeyPress}
            className={`${
              parseInt(inputValue2) === 0 ? "text-[#e7e8e9]" : inputValue2Color
            } text-center bg-transparent px-2 py-1 rounded-lg focus:outline-none focus:underline w-14 flex justify-center items-center`}
          />
        </div>
      </div>
    </li>
  );
}
