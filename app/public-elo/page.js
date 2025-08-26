"use client";

import { START_ELO } from "@/constants";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "next-themes";

export default function PublicEloPage() {
  const [players, setPlayers] = useState([]);
  const { player, _logout } = useAuthStore();
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch(`/api/statistics/public_elo`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        setPlayers(await response.json());
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    }

    fetchPlayers();
  }, []);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[5%] text-center">#</TableHead>
            <TableHead className="w-[50%] text-left">Name</TableHead>
            <TableHead className="w-[20%] text-center">ELO</TableHead>
            <TableHead className="w-[20%] text-center">% Win</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((p, index) => (
            <TableRow
              key={p.id}
              className={player === p.id ? "bg-foreground/15" : ""}
            >
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                {p.name}
              </TableCell>
              <TableCell
                className={`text-center font-semibold ${
                  p.elo === START_ELO
                    ? "text-gray-700 dark:text-gray-300"
                    : p.elo < START_ELO
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {p.elo}
              </TableCell>
              <TableCell
                className={`text-center font-semibold ${
                  p.win === 50
                    ? "text-gray-700 dark:text-gray-300"
                    : p.win < 50
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {p.win.toFixed(1)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
