"use client";

import { useActionState, useEffect } from "react";
import { signup } from "./actions";
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
  const [state, action, pending] = useActionState(signup, null);
  const router = useRouter();

  useEffect(() => {
    if (!pending && state?.success === true) {
      router.push("/start");
    }
  }, [state, pending]);

  return (
    <Card className="w-80 mx-auto mt-10">
      <CardHeader>
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form
          // className="w-80 bg-[#ffffff05] rounded-xl border-[#0000005b] border-2 mx-auto mt-10"
          action={action}
        >
          <div className="flex flex-col justify-start items-center gap-4 w-full">
            <Label htmlFor="name" className="w-full">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Ionel Popescu"
              defaultValue={state?.fields?.name || ""}
            />
            {state?.errors?.name && (
              <ul className="w-full text-red-400">
                {state.errors.name.map((e) => {
                  return (
                    <li className="text-start align-middle">
                      <span>- </span>
                      {e}
                    </li>
                  );
                })}
              </ul>
            )}
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
              Parola
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
            <Label htmlFor="passwordConfirmation" className="w-full">
              Confirma Parola
            </Label>
            <Input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
            />
            {state?.errors?.passwordConfirmation && (
              <ul className="w-full text-red-400">
                {state.errors.passwordConfirmation.map((e) => {
                  return (
                    <li className="text-start align-middle">
                      <span>- </span>
                      {e}
                    </li>
                  );
                })}
              </ul>
            )}
            <Button disabled={pending} type="submit" className="w-52 mt-3">
              {pending ? "..." : "Sign Up"}
            </Button>
            <div className="w-full flex flex-col gap-0 mt-3">
              <Label htmlFor="login" className="w-full text-center">
                Already have an account:
              </Label>
              <Button
                id="login"
                onClick={() => router.push("/login")}
                variant="ghost"
                className="underline text-sm"
              >
                Log In
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
