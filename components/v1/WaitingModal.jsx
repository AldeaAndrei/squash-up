import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Spinner } from "../ui/shadcn-io/spinner";

export default function WaitingModal({ title, description }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsed(((Date.now() - start) / 1000).toFixed(2));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50">
      <Card className="fixed w-5/6 min-h-1/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3">
        <CardHeader className="flex w-full items-center justify-center text-xl">
          <CardTitle className="mb-2">{title}</CardTitle>
          <CardDescription className="flex flex-col w-full items-center justify-center text-center">
            <p>{description}</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col w-full h-full items-center justify-between gap-2">
          <div className="flex flex-col w-full items-center justify-center">
            <Spinner />
          </div>
          <div className="w-full flex justify-end dark:text-gray-400 text-gray-700 font-thin text-sm">
            Busy for: {elapsed} s
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
