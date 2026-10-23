"use server";

// ==============================================================================
// Tenant / Newspaper Management Server Actions (FORM-01 & FORM-04)
// ==============================================================================
// Allows authenticated users to create private newspapers (as ADMIN)
// and join existing newspapers using secret invite codes (as READER).
// ==============================================================================

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import {
  createNewspaperSchema,
  joinNewspaperSchema,
} from "@/lib/validations/auth";
import type { ActionState } from "./auth";

/**
 * Creates a new private newspaper instance and grants the creator the ADMIN role.
 */
export async function createNewspaperAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
  };

  const validation = createNewspaperSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: "Please check your newspaper details.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { name, slug, description } = validation.data;

  try {
    // Verify that the slug is unique across the platform
    const existing = await prisma.newspaper.findUnique({
      where: { slug },
    });

    if (existing) {
      return {
        success: false,
        error: "This URL handle is already taken. Please pick another one.",
        fieldErrors: {
          slug: ["This URL handle is already in use."],
        },
      };
    }

    // Generate readable random invite code (e.g., FCV-8392)
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const inviteCode = `${slug.toUpperCase().slice(0, 4)}-${randomSuffix}`;

    // Create the newspaper with transaction: newspaper + admin member + default module config
    await prisma.$transaction(async (tx) => {
      const newspaper = await tx.newspaper.create({
        data: {
          name,
          slug,
          description,
          inviteCode,
        },
      });

      // Assign creator as ADMIN
      await tx.newspaperMember.create({
        data: {
          newspaperId: newspaper.id,
          userId: user.id,
          role: "ADMIN",
        },
      });

      // Default module configuration: all core modules enabled
      await tx.newspaperModuleConfig.create({
        data: {
          newspaperId: newspaper.id,
          hasPodcast: true,
          hasCalendar: true,
          hasMap: true,
          hasPdfExport: true,
          hasGallery: true,
        },
      });
    });
  } catch (error) {
    console.error("Error creating newspaper:", error);
    return {
      success: false,
      error: "Failed to create the newspaper. Please try again.",
    };
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard?created=${encodeURIComponent(slug)}`);
}

/**
 * Joins a private newspaper using an invite code. The joining member gets the READER role.
 */
export async function joinNewspaperAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const rawData = {
    inviteCode: formData.get("inviteCode"),
  };

  const validation = joinNewspaperSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: "Please provide a valid invite code.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { inviteCode } = validation.data;

  let targetSlug = "";

  try {
    const newspaper = await prisma.newspaper.findUnique({
      where: { inviteCode },
    });

    if (!newspaper) {
      return {
        success: false,
        error: "Invalid invite code. No matching private newspaper found.",
        fieldErrors: {
          inviteCode: ["No newspaper matches this code."],
        },
      };
    }

    targetSlug = newspaper.slug;

    // Check if the user is already a member
    const existingMembership = await prisma.newspaperMember.findUnique({
      where: {
        newspaperId_userId: {
          newspaperId: newspaper.id,
          userId: user.id,
        },
      },
    });

    if (existingMembership) {
      return {
        success: false,
        error: `You are already a member of "${newspaper.name}".`,
      };
    }

    // Join with default READER role
    await prisma.newspaperMember.create({
      data: {
        newspaperId: newspaper.id,
        userId: user.id,
        role: "READER",
      },
    });
  } catch (error) {
    console.error("Error joining newspaper:", error);
    return {
      success: false,
      error: "Could not join the newspaper. Please try again.",
    };
  }

  revalidatePath("/dashboard");
  redirect(`/${targetSlug}`);
}
