"use server";

// ==============================================================================
// Tenant Admin Server Actions (FORM-04)
// ==============================================================================
// Allows Newspaper Administrators to toggle dynamic feature modules,
// manage team members, and adjust role assignments.
// ==============================================================================

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireNewspaperRole } from "@/lib/auth";
import type { Role } from "@/lib/prisma";

/**
 * Updates dynamic module ON/OFF toggles for a specific newspaper (FORM-04).
 */
export async function updateModuleConfigAction(formData: FormData) {
  const newspaperSlug = formData.get("newspaperSlug") as string;
  await requireNewspaperRole(newspaperSlug, ["ADMIN"]);

  const hasPodcast = formData.get("hasPodcast") === "on";
  const hasCalendar = formData.get("hasCalendar") === "on";
  const hasMap = formData.get("hasMap") === "on";
  const hasPdfExport = formData.get("hasPdfExport") === "on";
  const hasGallery = formData.get("hasGallery") === "on";

  const newspaper = await prisma.newspaper.findUnique({
    where: { slug: newspaperSlug },
  });

  if (!newspaper) {
    throw new Error("Newspaper not found.");
  }

  await prisma.newspaperModuleConfig.upsert({
    where: { newspaperId: newspaper.id },
    create: {
      newspaperId: newspaper.id,
      hasPodcast,
      hasCalendar,
      hasMap,
      hasPdfExport,
      hasGallery,
    },
    update: {
      hasPodcast,
      hasCalendar,
      hasMap,
      hasPdfExport,
      hasGallery,
    },
  });

  revalidatePath(`/${newspaperSlug}/admin`);
  revalidatePath(`/${newspaperSlug}`);
}

/**
 * Updates the assigned role of a member in the private newspaper.
 */
export async function updateMemberRoleAction(formData: FormData) {
  const newspaperSlug = formData.get("newspaperSlug") as string;
  const memberId = formData.get("memberId") as string;
  const newRole = formData.get("role") as Role;

  await requireNewspaperRole(newspaperSlug, ["ADMIN"]);

  await prisma.newspaperMember.update({
    where: { id: memberId },
    data: { role: newRole },
  });

  revalidatePath(`/${newspaperSlug}/admin`);
}
