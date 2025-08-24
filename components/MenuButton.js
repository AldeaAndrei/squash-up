"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuthStore } from "@/app/store/authStore";

export default function MenuButton() {
  const { player, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  const handleLogout = async () => {
    const res = await fetch("/api/session", {
      method: "DELETE",
      cache: "no-store",
    });

    const data = await res.json();

    if (data.success) {
      logout();
      router.push("/login");
    }
  };

  const handleNavigate = (path) => {
    router.push(path);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md focus:outline-none"
      >
        <MenuIcon />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1d1f1e] rounded-lg border-black border-[1px]">
          {player != null && (
            <ul className="py-2">
              <li>
                <button
                  onClick={() => handleNavigate("/public-elo")}
                  className="block px-4 py-2 hover:translate-x-1 w-full text-left text-lg"
                >
                  Clasament
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("/history")}
                  className="block px-4 py-2 hover:translate-x-1 w-full text-left text-lg"
                >
                  Istoric
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("/start")}
                  className="block px-4 py-2 hover:translate-x-1 w-full text-left text-lg"
                >
                  Turneu nou
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("/player")}
                  className="block px-4 py-2 hover:translate-x-1 w-full text-left text-lg"
                >
                  Profil
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLogout()}
                  className="block px-4 py-2 hover:translate-x-1 w-full text-left text-lg"
                >
                  Log out
                </button>
              </li>
            </ul>
          )}
          {player == null && (
            <ul className="py-2">
              <li>
                <button
                  onClick={() => handleNavigate("/public-elo")}
                  className="block px-4 py-2 hover:translate-x-1 w-full text-left text-lg"
                >
                  Clasament
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("/signup")}
                  className="block px-4 py-2 hover:translate-x-1 w-full text-left text-lg"
                >
                  Inregistrare
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("/login")}
                  className="block px-4 py-2 hover:translate-x-1 w-full text-left text-lg"
                >
                  Logare
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
