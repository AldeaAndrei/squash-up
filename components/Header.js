import { SITE_NAME } from "@/constants";

export default function Header() {
  return (
    <header className="min-h-5 bg-gray-800 text-white font-semibold text-2xl p-2">
      <nav className="flex flex-row">
        <h1>{SITE_NAME}</h1>
      </nav>
    </header>
  );
}
