
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import EditProfileForm from "@/components/profile/EditProfileForm";
import { connection } from "next/server";

type Props = {
  params: Promise<{ username: string }>;
};

async function ProfileContent({ params }: Props) {
  await connection();

  const { username } = await params;

  const [session, user] = await Promise.all([
    auth(),
    prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatarUrl: true,
        _count: {
          select: { posts: true },
        },
        posts: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            imageUrl: true,
            caption: true,
          },
        },
      },
    }),
  ]);

  if (!user) {
    notFound();
  }

  const isOwner = session?.user?.id === user.id;

  return (
    <section className="space-y-8">
      {/* Profile Header */}
      <header className="flex items-center gap-6">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={`${user.username}'s avatar`}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-3xl">
            {user.username[0].toUpperCase()}
          </div>
        )}

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {user.username}
          </h1>

          <div className="flex gap-6">
            <p>
              <strong>{user._count.posts}</strong> posts
            </p>
          </div>

          <p>{user.name}</p>
        </div>
      </header>

      {/* Profile Bio */}
      {user.bio && <p>{user.bio}</p>}

      {/* Edit Profile */}
      {isOwner && (
        <EditProfileForm
          name={user.name ?? ""}
          bio={user.bio ?? ""}
        />
      )}

      {/* Posts Section */}
      <div className="border-t pt-6">
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-wider">
          Posts
        </h2>

        {user.posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-1 sm:gap-3">
            {user.posts.map((post) => (
              <div
                key={post.id}
                className="group relative aspect-square overflow-hidden bg-gray-100"
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption || "User post"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {post.caption && (
                  <div className="absolute inset-0 hidden items-center justify-center bg-black/50 p-3 text-center text-sm text-white group-hover:flex">
                    {post.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <h3 className="text-xl font-semibold">
              No posts yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {isOwner
                ? "Share your first photo with the world."
                : "This user hasn't shared any posts yet."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ProfilePage({ params }: Props) {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Suspense fallback={<p>Loading profile...</p>}>
        <ProfileContent params={params} />
      </Suspense>
    </main>
  );
}
