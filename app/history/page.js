"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmationModal from "@/components/v1/ConfirmationModal";

export default function HistoryPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState(null);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleClose = () => {
    setIsDeleteModalOpen(false);
    setTournamentToDelete(null);
  };

  const handleDelete = (tournamentId) => {
    setTournamentToDelete(tournamentId);
    setIsDeleteModalOpen(true);
  };

  // const deleteTournamentAndReload = (tournamentId) => {
  //   const deleteTournament = async () => {
  //     try {
  //       const response = await fetch(`/api/tournaments/${tournamentId}`, {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error("Error deleting tournament");
  //       }

  //       return await response.json();
  //     } catch (error) {
  //       console.error("Error deleting tournament", error);
  //       return null;
  //     }
  //   };

  //   deleteTournament()
  //     .then(() => {
  //       router.refresh();
  //     })
  //     .finally(() => {
  //       handleClose();
  //     });
  // };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v1/tournaments?page=${page}&perPage=5`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setTournaments(data.tournaments || []);
        setTotalPages(data.pagination.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  return (
    <div className="p-4">
      <section>
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="h-2">
              <TableHead className="text-start w-[15%] h-5"># Tr.</TableHead>
              <TableHead className="text-center w-[35%] h-5">Date</TableHead>
              <TableHead className="text-center w-[50%] h-5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow className="h-2" key={i}>
                    <TableCell className="text-start w-[15%] h-5">
                      <div className="w-full h-full py-3">
                        <Skeleton className="w-full h-full" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center w-[35%] h-5">
                      <div className="w-full h-full py-3">
                        <Skeleton className="w-full h-full" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center w-[50%] h-5">
                      <Button
                        variant="ghost"
                        className="text-accent"
                        disabled={true}
                      >
                        Delete
                      </Button>
                      <Button
                        className="text-accent"
                        variant="ghost"
                        disabled={true}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : tournaments.map((tournament) => (
                  <TableRow className="h-2" key={tournament.id}>
                    <TableCell className="text-start w-[15%] h-5">
                      #{tournament.id}
                    </TableCell>
                    <TableCell className="text-center w-[35%] h-5">
                      {formatDate(tournament.created_at)}
                    </TableCell>
                    <TableCell className="text-center w-[50%] h-5">
                      <Button
                        variant="ghost"
                        className="text-red-600"
                        disabled={loading}
                        onClick={() => handleDelete(tournament.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() =>
                          router.push(`/tournament/${tournament.id}`)
                        }
                        variant="ghost"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <div className="flex justify-between mt-4">
          <Button
            variant="secondary"
            size="icon"
            className="size-8"
            disabled={loading || page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            <ChevronLeftIcon />
          </Button>
          <span>
            Page {loading ? page ?? "1" : page} of{" "}
            {loading ? totalPages ?? "..." : totalPages}
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="size-8"
            disabled={loading || page >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </section>
      {isDeleteModalOpen && (
        <ConfirmationModal
          title={`Delete tournament #${tournamentToDelete}`}
          description={
            "This action will delete the tournament and cannot be undone."
          }
          confirmAction={handleClose}
          closeAction={handleClose}
          loading={loading}
        />
      )}
    </div>
  );
}
