
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validations/profile";
import { revalidatePath } from "next/cache";

export type ProfileState = {
  success: boolean;
  message: string;
};

export async function updateProfile(
  _previousState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in",
    };
  }

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    bio: formData.get("bio"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message,
    };
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: parsed.data,
    });

    revalidatePath(`/profile/${user.username}`);

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch {
    return {
      success: false,
      message: "Unable to update profile",
    };
  }
}
