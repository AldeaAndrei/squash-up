"use client";

import { useRouter } from "next/navigation";

export default function NavigationButton({ path, text }) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(path);
  };

  return (
    <button
      className={`bg-green-500 p-1 w-32 rounded-xl border-green-800 border-2`}
      onClick={() => handleRedirect()}
    >
      {text}
    </button>
  );
}
