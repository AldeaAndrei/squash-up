"use client";

import MenuButton from "./MenuButton";
import { SITE_NAME } from "@/constants";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  CircleUserRound,
  ClipboardClock,
  ClipboardPlus,
  ListOrdered,
  LogIn,
  Menu,
  Moon,
  Sun,
  UserPlus,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/app/store/authStore";
import { Logout } from "@mui/icons-material";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { player, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();

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
    setIsOpen(false);
    router.push(path);
  };

  return (
    <header className="min-h-5 font-semibold text-2xl p-2">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <nav className="flex flex-row justify-between items-center">
          <h1 onClick={() => router.push("/start")}>{SITE_NAME}</h1>
          <div className="flex gap-2 pr-3">
            <Button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              variant="ghost"
              size="icon"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            </Button>
            <SheetTrigger>
              <Menu />
            </SheetTrigger>
          </div>
        </nav>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="sr-only">Main navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Menu with navigation links
            </SheetDescription>
          </SheetHeader>
          {player != null && (
            <ul className="pt-10">
              <li>
                <Button
                  variant="ghost"
                  onClick={() => handleNavigate("/public-elo")}
                >
                  <ListOrdered />
                  Leaderboard
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  onClick={() => handleNavigate("/history")}
                >
                  <ClipboardClock />
                  Tournaments History
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  onClick={() => handleNavigate("/player")}
                >
                  <CircleUserRound />
                  Profile
                </Button>
              </li>
              <br />
              <li>
                <Button
                  variant="ghost"
                  onClick={() => handleNavigate("/start")}
                >
                  <ClipboardPlus />
                  New Tournament
                </Button>
              </li>
              {pathname.startsWith("/tournament/") && params.id && (
                <li>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigate("/start")}
                  >
                    <ClipboardPlus />
                    New Game
                  </Button>
                </li>
              )}
              <br />
              <li>
                <Button variant="ghost" onClick={() => handleLogout()}>
                  <Logout />
                  Log Out
                </Button>
              </li>
            </ul>
          )}
          {player == null && (
            <ul className="py-2">
              <li>
                <Button
                  variant="ghost"
                  onClick={() => handleNavigate("/public-elo")}
                >
                  <ListOrdered />
                  Leaderboard
                </Button>
              </li>

              <li>
                <Button
                  variant="ghost"
                  onClick={() => handleNavigate("/signup")}
                >
                  <UserPlus />
                  Sign Up
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  onClick={() => handleNavigate("/login")}
                >
                  <LogIn />
                  Log In
                </Button>
              </li>
            </ul>
          )}
        </SheetContent>
      </Sheet>
    </header>
  );
}
