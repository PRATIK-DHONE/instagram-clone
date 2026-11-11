
import { Suspense } from "react";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

// This component runs when a user requests the page.
async function AuthenticatedFeed() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <section>
      <p className="mt-4">
        Welcome, {session.user.name}!
      </p>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button
          type="submit"
          className="mt-6 rounded bg-red-600 px-4 py-2 text-white"
        >
          Sign Out
        </button>
      </form>
    </section>
  );
}

// This component provides the static page shell.
export default function FeedPage() {
  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-3xl font-bold">
        Instagram Feed
      </h1>

      <Suspense fallback={<p>Loading your feed...</p>}>
        <AuthenticatedFeed />
      </Suspense>
    </main>
  );
}
