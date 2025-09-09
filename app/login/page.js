"use client";

import { useActionState, useEffect } from "react";
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

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);
  const router = useRouter();

  useEffect(() => {
    if (!pending && state?.success === true) {
      router.push("/start");
    }
  }, [state, pending]);

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
            />
            {state?.errors?.username && (
              <ul className="w-full text-red-400">
                {state.errors.username.map((e) => {
                  return (
                    <li className="text-start align-middle">
                      <span>- </span>
                      {e}
                    </li>
                  );
                })}
              </ul>
            )}
            <Label htmlFor="password" className="w-full">
              Password
            </Label>
            <Input id="password" name="password" type="password" />
            {state?.errors?.password && (
              <ul className="w-full text-red-400">
                {state.errors.password.map((e) => {
                  return (
                    <li className="text-start align-middle">
                      <span>- </span>
                      {e}
                    </li>
                  );
                })}
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
    </Card>
  );
}
