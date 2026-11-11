
"use client";

import { useActionState } from "react";
import { loginUser } from "@/app/actions/auth-actions";

const initialState = {
  success: false,
  message: "",
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState
  );

  return (
    <form action={formAction}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        required
      />

      {state.message && (
        <p role="alert">{state.message}</p>
      )}

      <button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
