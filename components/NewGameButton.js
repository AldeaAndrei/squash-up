"use client";

import { Fragment, useState } from "react";
import Modal from "@mui/material/Modal";
import SimpleButton from "./SimpleButton";
import CachedIcon from "@mui/icons-material/Cached";
import NavigationButton from "./NavigationButton";

export default function NewGameButton({ noText }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <Fragment>
      <SimpleButton onClick={() => handleOpen()}>
        <div>
          <CachedIcon />
          {!noText && <span>Turneu Nou</span>}
        </div>
      </SimpleButton>
      <Modal open={isModalOpen} onClose={handleClose}>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="flex flex-col justify-center items-center text-center gap-5 bg-[#1e2021] border-2 border-black shadow-lg p-4 w-96 rounded-lg">
            <h1 className="font-semibold text-2xl">Incepi un turneu nou ?</h1>
            <div className="flex justify-center items-center gap-2">
              <NavigationButton path="/start" text="Continua" noIcon={true} />
              <SimpleButton text={"Renunta"} onClick={() => handleClose()} />
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}
