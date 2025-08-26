"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";

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
    if (type === 1) return "1 Round";
    if (type === 3) return "Best 2 of 3 rounds";
  };

  const changeGameType = () => {
    const newType = type === 1 ? 3 : 1;
    setType(newType);
  };

  return (
    <Button variant="outline" onClick={() => changeGameType()}>
      {parseGameType()}
    </Button>
  );
}
