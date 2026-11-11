
"use server";

import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { hash } from "bcryptjs";
import { Prisma } from "@/generated/prisma/client";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type RegisterResult = {
  success: boolean;
  message: string;
};

export async function registerUser(
  formData: FormData
): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message,
    };
  }

  const { username, email, password } = parsed.data;

  try {
    const passwordHash = await hash(password, 12);

    await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });

    return {
      success: true,
      message: "Account created successfully",
    };
  } catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error("Prisma error code:", error.code);
    console.error("Prisma error metadata:", error.meta);
  } else {
    console.error("Registration error:", error);
  }

  return {
    success: false,
    message: "Registration failed",
  };
}
}

type LoginState = {
  success: boolean;
  message: string;
};

export async function loginUser(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/feed",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Important: Next.js redirects must be rethrown
    throw error;
  }

  return {
    success: true,
    message: "Login successful",
  };
}