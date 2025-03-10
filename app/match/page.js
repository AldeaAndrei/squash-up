"use client";

import AddRoundButton from "@/components/AddRoundButton";
import GameList from "@/components/GameList";
import NavigationButton from "@/components/NavigationButton";
import SimpleButton from "@/components/SimpleButton";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import CachedIcon from "@mui/icons-material/Cached";

export default function MatchPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <div>DEPRECATED</div>
    // <div className="p-2">
    //   <section className="my-5">
    //     <div className="flex gap-2 justify-center items-center">
    //       <NavigationButton path="/leaderboard" text="" />
    //       <AddRoundButton />
    //       <SimpleButton onClick={() => handleOpen()}>
    //         <div>
    //           <CachedIcon /> Joc Nou
    //         </div>
    //       </SimpleButton>
    //     </div>
    //   </section>
    //   <section className="flex flex-col gap-2">
    //     <GameList />
    //   </section>
    //   <Modal open={isModalOpen} onClose={handleClose}>
    //     <div className="fixed inset-0 flex items-center justify-center p-4">
    //       <div className="flex flex-col justify-center items-center text-center gap-5 bg-[#1e2021] border-2 border-black shadow-lg p-4 w-96 rounded-lg">
    //         <h1 className="font-semibold text-2xl">
    //           Toate datele curente vor fi sterse!
    //         </h1>
    //         <div className="flex justify-center items-center gap-2">
    //           <NavigationButton path="/start" text="Continua" noIcon={true} />
    //           <SimpleButton text={"Renunta"} onClick={() => handleClose()} />
    //         </div>
    //       </div>
    //     </div>
    //   </Modal>
    // </div>
  );
}
