"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser, type RegisterResult } from "@/app/actions/auth-actions";

export default function RegisterPage() {
  const router = useRouter();

  const [result, setResult] = useState<RegisterResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await registerUser(formData);

      setResult(response);

      if (response.success) {
        router.push("/login");
      }
    } catch {
      setResult({
        success: false,
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl border p-8"
      >
        <h1 className="text-2xl font-bold">Create an account</h1>

        <input
          name="username"
          placeholder="Username"
          aria-label="Username"
          autoComplete="username"
          required
          minLength={3}
          className="rounded border p-3"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          aria-label="Email"
          autoComplete="email"
          required
          className="rounded border p-3"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          aria-label="Password"
          autoComplete="new-password"
          required
          minLength={8}
          className="rounded border p-3"
        />

        {result && (
          <p role="status" className="text-sm">
            {result.message}
          </p>
        )}

        <button
          disabled={loading}
          className="rounded bg-blue-600 p-3 text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <Link href="/login" className="text-center text-sm">
          Already have an account? Login
        </Link>
      </form>
    </main>
  );
}
