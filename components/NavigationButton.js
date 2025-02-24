"use client";

import { useRouter } from "next/navigation";

export default function NavigationButton({ path, text }) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(path);
  };

  return (
    <button
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded`}
      onClick={() => handleRedirect()}
    >
      {text}
    </button>
  );
}
