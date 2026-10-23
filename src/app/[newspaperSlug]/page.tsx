import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Newspaper,
  ShieldAlert,
  Settings,
  PenSquare,
  Users,
  Calendar,
  Headphones,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const instant = false;

export default async function NewspaperReaderPage({
  params,
}: {
  params: Promise<{ newspaperSlug: string }>;
}) {
  const { newspaperSlug } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?callbackUrl=/${newspaperSlug}`);
  }

  // Fetch newspaper with module configuration and articles
  const newspaper = await prisma.newspaper.findUnique({
    where: { slug: newspaperSlug },
    include: {
      moduleConfig: true,
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      articles: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        include: {
          author: {
            select: { name: true },
          },
        },
      },
    },
  });

  if (!newspaper) {
    notFound();
  }

  // Check if current user is an invited member of this private newspaper
  const currentMembership = newspaper.members.find((m) => m.userId === user.id);

  if (!currentMembership) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            Private Newspaper Access
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            &quot;{newspaper.name}&quot; is a private publication restricted to invited members
            only. You need an invite code to join this group.
          </p>
          <div className="space-y-3">
            <Link
              href="/join-newspaper"
              className="block w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
            >
              Enter Invite Code
            </Link>
            <Link
              href="/dashboard"
              className="block w-full py-2.5 px-4 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const role = currentMembership.role;
  const isAdmin = role === "ADMIN";
  const isEditor = role === "EDITOR" || isAdmin;
  const modules = newspaper.moduleConfig;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-serif">
      {/* Newspaper Masthead / Header */}
      <header className="border-b-4 border-double border-stone-800 bg-stone-100 py-6 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Platform Back Link */}
          <Link
            href="/dashboard"
            className="text-xs font-sans font-semibold tracking-wider uppercase text-stone-500 hover:text-stone-900 transition flex items-center gap-1.5"
          >
            ← My Dashboard
          </Link>

          {/* Title & Tagline */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-stone-950 font-serif">
              {newspaper.name}
            </h1>
            {newspaper.description && (
              <p className="text-xs sm:text-sm italic text-stone-600 mt-1 max-w-lg mx-auto">
                {newspaper.description}
              </p>
            )}
          </div>

          {/* User Role Badge & Actions */}
          <div className="flex items-center gap-2 font-sans">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-stone-800 text-stone-100">
              Role: {role}
            </span>

            {isEditor && (
              <Link
                href={`/${newspaper.slug}/editorial`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>Editorial</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                href={`/${newspaper.slug}/admin`}
                className="p-1.5 rounded border border-stone-300 hover:bg-stone-200 text-stone-700 transition"
                title="Admin Settings"
              >
                <Settings className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Issue Date & Subline */}
        <div className="max-w-6xl mx-auto mt-4 pt-2 border-t border-stone-300 flex items-center justify-between text-xs font-sans text-stone-500 uppercase tracking-widest">
          <span>Private Issue • Closed Community</span>
          <span>{new Date(newspaper.updatedAt).toLocaleDateString("en-US", { dateStyle: "full" })}</span>
          <span>Members: {newspaper.members.length}</span>
        </div>
      </header>

      {/* Feature Modules Bar (Dynamic Toggles) */}
      <div className="border-b border-stone-200 bg-white font-sans text-xs">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-stone-600">
          <div className="flex items-center gap-4">
            <span className="font-bold text-stone-900 uppercase tracking-wider">
              Sections:
            </span>
            <span className="text-stone-800 font-medium">Frontpage</span>
            {modules?.hasPodcast && (
              <span className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer">
                <Headphones className="w-3.5 h-3.5" /> Podcast Archive
              </span>
            )}
            {modules?.hasCalendar && (
              <span className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer">
                <Calendar className="w-3.5 h-3.5" /> Event Calendar
              </span>
            )}
          </div>

          <div className="text-[11px] text-stone-400">
            Private Access: Verified Member ({user.name})
          </div>
        </div>
      </div>

      {/* Main Frontpage Content */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        {newspaper.articles.length === 0 ? (
          /* Empty State for Articles */
          <div className="bg-white border-2 border-stone-200 rounded-xl p-12 text-center my-8 font-sans">
            <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
              <Newspaper className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">
              No Published Articles in this Issue Yet
            </h2>
            <p className="text-sm text-stone-500 max-w-md mx-auto mt-2 mb-6">
              The editorial desk has not published any articles yet.
              {isEditor
                ? " As an Editor, you can begin writing drafts in the Editorial Studio!"
                : " Check back soon once the editorial team releases the next issue."}
            </p>

            {isEditor && (
              <Link
                href={`/${newspaper.slug}/editorial`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition"
              >
                <PenSquare className="w-4 h-4" />
                <span>Open Editorial Studio & Draft Article</span>
              </Link>
            )}
          </div>
        ) : (
          /* Articles Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newspaper.articles.map((article, idx) => (
              <article
                key={article.id}
                className={`bg-white border border-stone-200 p-6 rounded-lg shadow-xs flex flex-col justify-between ${
                  idx === 0 ? "md:col-span-2 md:p-8" : ""
                }`}
              >
                <div>
                  <div className="text-xs font-sans uppercase font-bold text-indigo-600 tracking-wider mb-2">
                    Report • By {article.author.name}
                  </div>
                  <h2
                    className={`font-bold font-serif text-stone-950 leading-tight mb-3 ${
                      idx === 0 ? "text-2xl sm:text-3xl" : "text-xl"
                    }`}
                  >
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-stone-700 text-sm leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-100 text-xs font-sans text-stone-400 flex items-center justify-between">
                  <span>
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString()
                      : "Recently"}
                  </span>
                  <span className="text-indigo-600 font-semibold hover:underline">
                    Read Story →
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Newspaper Footer */}
      <footer className="border-t-2 border-stone-800 bg-stone-100 py-6 px-4 text-center font-sans text-xs text-stone-500">
        <p>
          {newspaper.name} • Private Digital Community Edition • Powered by up2date
        </p>
      </footer>
    </div>
  );
}
