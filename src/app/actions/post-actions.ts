"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { createPostSchema } from "@/lib/validations/post";
import { revalidatePath } from "next/cache";

export type PostState = {
  success: boolean;
  message: string;
};

export async function createPost(
  _prevState: PostState,
  formData: FormData,
): Promise<PostState> {
  try {
    // 1. Authenticate the user
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Please log in to create a post.",
      };
    }

    // 2. Get form data
    const caption = formData.get("caption");
    const image = formData.get("image");

    // 3. Validate caption
    const validated = createPostSchema.safeParse({
      caption: caption ?? "",
    });

    if (!validated.success) {
      return {
        success: false,
        message: validated.error.issues[0].message,
      };
    }

    // 4. Validate image
    if (!(image instanceof File) || image.size === 0) {
      return {
        success: false,
        message: "Please select an image.",
      };
    }

    if (!image.type.startsWith("image/")) {
      return {
        success: false,
        message: "Only image files are allowed.",
      };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(image.type)) {
      return {
        success: false,
        message: "Only JPG, PNG and WebP images are supported.",
      };
    }

    if (image.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: "Image size must be less than 5 MB.",
      };
    }

    // 5. Upload image to Cloudinary
    const buffer = Buffer.from(await image.arrayBuffer());

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "instagram-clone/posts",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Image upload failed."));
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );

      uploadStream.end(buffer);
    });

    // 6. Save post in PostgreSQL
    const post = await prisma.post.create({
      data: {
        caption: validated.data.caption || null,
        imageUrl: uploadResult.secure_url,
        imagePath: uploadResult.public_id,
        authorId: session.user.id,
      },
    });

    // 7. Refresh profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { username: true },
    });

    if (user) {
      revalidatePath(`/profile/${user.username}`);
    }

    return {
      success: true,
      message: "Post created successfully!",
    };
  } catch (error) {
    console.error("Create post error:", error);

    return {
      success: false,
      message: "Unable to create post. Please try again.",
    };
  }
}
