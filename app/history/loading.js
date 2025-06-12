import { FadeLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="w-full flex justify-center mt-10">
      <FadeLoader />
    </div>
  );
}
