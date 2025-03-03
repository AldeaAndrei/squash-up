"use client";

export default function SimpleButton({ text, children, onClick }) {
  return (
    <button
      className={`bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded`}
      onClick={onClick}
    >
      <div className="flex flex-row justify-center items-center">
        {!children && text && <span className="ml-1">{text}</span>}
        {children}
      </div>
    </button>
  );
}
