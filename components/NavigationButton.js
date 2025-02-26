"use client";

import { useRouter } from "next/navigation";

export default function NavigationButton({ path, children }) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(path);
  };

  return (
    <button
      className={`bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded`}
      onClick={() => handleRedirect()}
    >
      <div className="flex flex-row justify-center items-center">
        {children ?? path}
      </div>
    </button>
  );
}
