
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Instagram Clone
      </h1>

      <p className="text-gray-500">
        Built using Next.js and PostgreSQL
      </p>

      <div className="flex gap-4">
        <a
          href="/login"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          Login
        </a>

        <a
          href="/register"
          className="rounded-lg border px-6 py-3"
        >
          Register
        </a>
      </div>
    </main>
  );
}
