"use client";

import { useActionState, useEffect, useState } from "react";
import { login } from "./actions";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import WaitingModal from "@/components/v1/WaitingModal";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);
  const router = useRouter();
  const [redirect, setRedirect] = useState("/start");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRedirect(params.get("redirect") || "/start");
  }, []);

  useEffect(() => {
    if (!pending && state?.success === true) {
      router.push(state.redirectTo);
    }
  }, [state, pending, router]);

  return (
    <Card className="w-80 mx-auto mt-10">
      <CardHeader className="w-full">
        <CardTitle>Log in</CardTitle>
        <CardDescription>
          Enter your username and password to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action}>
          <input type="hidden" name="redirect" value={redirect} />
          <div className="flex flex-col justify-start items-center gap-4 w-full">
            <Label htmlFor="username" className="w-full">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="ionelpopescu69"
              defaultValue={state?.fields?.username || ""}
              autoCapitalize="none"
              autoCorrect="off"
            />
            {state?.errors?.username && (
              <ul className="w-full text-red-400">
                {state.errors.username.map((e, i) => (
                  <li key={i} className="text-start align-middle">
                    <span>- </span>
                    {e}
                  </li>
                ))}
              </ul>
            )}
            <Label htmlFor="password" className="w-full">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
            />
            {state?.errors?.password && (
              <ul className="w-full text-red-400">
                {state.errors.password.map((e, i) => (
                  <li key={i} className="text-start align-middle">
                    <span>- </span>
                    {e}
                  </li>
                ))}
              </ul>
            )}
            <div>
              {state?.errors?.login && (
                <p className="w-full text-red-400">{state.errors.login}</p>
              )}
            </div>
            <Button disabled={pending} type="submit" className="w-52">
              {pending ? "..." : "Log In"}
            </Button>
            <Button
              onClick={() => router.push("/signup")}
              variant="ghost"
              className="underline text-sm"
            >
              Create an account
            </Button>
          </div>
        </form>
      </CardContent>
      {pending && <WaitingModal title={`Just a moment...`} />}
    </Card>
  );
}
