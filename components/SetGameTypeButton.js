"use client";

import { useEffect, useState } from "react";

export default function SetGameTypeButton() {
  const [type, setType] = useState(3);

  useEffect(() => {
    const storedType = localStorage.getItem("gameType");
    if (storedType) {
      try {
        setType(JSON.parse(storedType));
      } catch (error) {
        setType([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gameType", JSON.stringify(type));
  }, [type]);

  const parseGameType = () => {
    if (type === 1) return "1 Runda";
    if (type === 3) return "2/3 Runde";
  };

  const changeGameType = () => {
    const newType = type === 1 ? 3 : 1;
    setType(newType);
  };

  return (
    <button
      className="bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded"
      onClick={() => changeGameType()}
    >
      {parseGameType()}
    </button>
  );
}
