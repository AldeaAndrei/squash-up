import MenuButton from "./MenuButton";
import SiteNameButton from "./SiteNameButton";

export default function Header() {
  return (
    <header className="min-h-5 bg-[#1d1f1e] font-semibold text-2xl p-2">
      <nav className="flex flex-row justify-between items-center">
        <SiteNameButton />
        <MenuButton />
      </nav>
    </header>
  );
}
