"use client";

import { useActionState, useEffect } from "react";
import { login } from "./actions";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);
  const router = useRouter();

  useEffect(() => {
    if (!pending && state?.success) {
      router.push("/start");
    }
  }, [state, pending]);

  return (
    <form
      className="w-80 bg-[#ffffff05] rounded-xl border-[#0000005b] border-2 mx-auto mt-10"
      action={action}
    >
      <div className="flex flex-col justify-start items-center gap-4 w-full px-3 pt-2">
        <label htmlFor="username" className="w-full">
          Username
        </label>
        <input
          className="px-1 border-b-2 text-black w-full"
          id="username"
          name="username"
          type="username"
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
        <label htmlFor="password" className="w-full">
          Parola
        </label>
        <input
          className="px-1 border-b-2 text-black w-full"
          id="password"
          name="password"
          type="password"
        />
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
        <button
          disabled={pending}
          type="submit"
          className="bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded w-72 mb-10"
        >
          {pending ? "..." : "Log In"}
        </button>
      </div>
    </form>
  );
}
