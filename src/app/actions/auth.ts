"use server";

// ==============================================================================
// Authentication Server Actions (FORM-01)
// ==============================================================================
// Handles user registration, login verification, and session logout.
// Enforces Zod validation and returns structured errors for UI feedback.
// ==============================================================================

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { hashPassword, verifyPassword, createSession, deleteSession } from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validations/auth";

export interface ActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Registers a new user account with encrypted password storage.
 */
export async function registerAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validation = registerSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: "Please correct the errors in the form.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validation.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email address already exists.",
        fieldErrors: {
          email: ["An account with this email address already exists."],
        },
      };
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    await createSession(newUser.id);
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during registration. Please try again.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Authenticates an existing user and initializes a session.
 */
export async function loginAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: "Invalid email or password format.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validation.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        error: "Invalid credentials. Please verify your email and password.",
      };
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return {
        success: false,
        error: "Invalid credentials. Please verify your email and password.",
      };
    }

    await createSession(user.id);
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during login. Please try again.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Logs out the active user and invalidates the session cookie.
 */
export async function logoutAction(): Promise<void> {
  await deleteSession();
  revalidatePath("/", "layout");
  redirect("/login");
}
