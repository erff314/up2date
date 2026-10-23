import Link from "next/link";
import {
  PlusCircle,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  BookOpen,
  ArrowUpRight,
  Settings,
  Newspaper as NewspaperIcon,
  Users,
  Copy,
} from "lucide-react";
import { requireUser } from "@/lib/auth";

export const instant = false;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; error?: string }>;
}) {
  const user = await requireUser();
  const { created, error } = await searchParams;

  const roleBadgeStyles: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-800 border-purple-200",
    EDITOR: "bg-blue-100 text-blue-800 border-blue-200",
    PROOFREADER: "bg-amber-100 text-amber-800 border-amber-200",
    READER: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };

  return (
    <div className="space-y-8">
      {/* Success / Error Banners */}
      {created && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Success!</span>
            <span>Your private newspaper has been created. Invite your team below!</span>
          </div>
          <Link
            href={`/${created}`}
            className="text-xs font-semibold underline hover:no-underline"
          >
            Visit Newspaper →
          </Link>
        </div>
      )}

      {error === "unauthorized" && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-sm flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>
            You do not have the required permissions to access that section of the newspaper.
          </span>
        </div>
      )}

      {/* Hero Welcome Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Private Community Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Hello, {user.name} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Manage your digital group newspapers, draft content, or collaborate with your
            editorial team.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/join-newspaper"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-sm font-semibold shadow-xs transition"
          >
            <KeyRound className="w-4 h-4 text-slate-500" />
            <span>Join with Code</span>
          </Link>

          <Link
            href="/create-newspaper"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Newspaper</span>
          </Link>
        </div>
      </div>

      {/* Publications Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <NewspaperIcon className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Your Newspapers ({user.memberships.length})
            </h2>
          </div>
        </div>

        {user.memberships.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <NewspaperIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No newspapers yet
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              You are not a member of any private newspaper yet. Create one for your club or
              join an existing one using an invite code.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/create-newspaper"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition"
              >
                Create Newspaper
              </Link>
              <Link
                href="/join-newspaper"
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
              >
                Enter Invite Code
              </Link>
            </div>
          </div>
        ) : (
          /* Newspaper Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {user.memberships.map((membership) => {
              const { newspaper, role } = membership;
              const isAdmin = role === "ADMIN";
              const isEditor = role === "EDITOR" || isAdmin;

              return (
                <div
                  key={membership.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Title & Role Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-lg text-slate-900 tracking-tight leading-snug">
                        {newspaper.name}
                      </h3>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase ${
                          roleBadgeStyles[role] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {role}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-4 font-mono">
                      /{newspaper.slug}
                    </p>

                    {/* Invite Code Box for Admins */}
                    {isAdmin && (
                      <div className="mb-4 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                          Private Invite Code
                        </span>
                        <div className="flex items-center justify-between">
                          <code className="text-xs font-mono font-bold text-slate-800">
                            {newspaper.inviteCode}
                          </code>
                          <span className="text-[10px] text-slate-400">
                            Share with members
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/${newspaper.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open Issue</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>

                    <div className="flex items-center gap-1">
                      {isEditor && (
                        <Link
                          href={`/${newspaper.slug}/editorial`}
                          title="Editorial Studio"
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition"
                        >
                          Editorial
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          href={`/${newspaper.slug}/admin`}
                          title="Newspaper Admin Settings"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition"
                        >
                          <Settings className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
