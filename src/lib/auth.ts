// ==============================================================================
// Authentication & Session Management Helper
// ==============================================================================
// Utilizes bcryptjs for secure salted password hashing and jose for signed
// HTTP-only JWT session cookies. Fully compliant with Next.js App Router.
// ==============================================================================

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "./prisma";
import type { Role } from "../generated/prisma/client";

const COOKIE_NAME = "up2date_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Secret key for HMAC signing (derived from environment or secure development fallback)
const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "default-dev-secret-key-must-be-min-32-chars-long"
);

// ------------------------------------------------------------------------------
// PASSWORD HASHING (BCRYPT)
// ------------------------------------------------------------------------------

/**
 * Hashes a plaintext password with a salt round factor of 10.
 * Never store plaintext passwords in the database.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compares a candidate plaintext password against an existing hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ------------------------------------------------------------------------------
// SESSION MANAGEMENT (JOSE JWT COOKIES)
// ------------------------------------------------------------------------------

interface SessionPayload {
  userId: string;
}

/**
 * Signs a cryptographic JWT session token and stores it in an HTTP-only cookie.
 */
export async function createSession(userId: string): Promise<void> {
  const jwt = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, jwt, {
    httpOnly: true, // Prevents JavaScript access in the browser (mitigates XSS)
    secure: process.env.NODE_ENV === "production", // Enforces HTTPS in production
    sameSite: "lax", // CSRF protection
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });
}

/**
 * Reads and verifies the current session token from the HTTP-only cookie.
 * Returns the decoded payload or null if invalid or expired.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });

    if (typeof payload.userId === "string") {
      return { userId: payload.userId };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Deletes the session cookie on user logout.
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ------------------------------------------------------------------------------
// USER & TENANT RBAC GUARDS
// ------------------------------------------------------------------------------

/**
 * Retrieves the currently authenticated user including all newspaper memberships.
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
        memberships: {
          include: {
            newspaper: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
                inviteCode: true,
              },
            },
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

/**
 * Route protection: requires an active user session or redirects to /login.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Tenant-scoped Role Guard: checks if the current user has one of the allowed roles
 * for a specific newspaper. Redirects or returns member info.
 */
export async function requireNewspaperRole(
  newspaperSlug: string,
  allowedRoles: Role[]
) {
  const user = await requireUser();

  const membership = user.memberships.find(
    (m) => m.newspaper.slug === newspaperSlug
  );

  if (!membership || !allowedRoles.includes(membership.role)) {
    redirect(`/dashboard?error=unauthorized`);
  }

  return { user, membership, newspaper: membership.newspaper };
}
