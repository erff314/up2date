import Link from "next/link";
import {
  Newspaper,
  ShieldCheck,
  ToggleRight,
  Headphones,
  Calendar,
  MapPin,
  FileDown,
  ArrowRight,
  Users,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export const instant = false;

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Newspaper className="w-5 h-5" />
            </div>
            <span>
              up2date<span className="text-indigo-400">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold transition flex items-center gap-2 shadow-sm"
              >
                <span>Dashboard ({user.name.split(" ")[0]})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold transition shadow-lg shadow-indigo-600/30"
                >
                  Create Newspaper
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Users className="w-3.5 h-3.5" />
            <span>Private Group Publishing Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Your Team&apos;s Private Digital Newspaper.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-300">
              Modular & Closed.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Designed specifically for sports clubs, school classes, families, and internal
            organizations. Create, host, proofread, and release private digital publications
            with custom feature modules.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={user ? "/dashboard" : "/register"}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              <span>{user ? "Open Your Dashboard" : "Start Your Free Group Newspaper"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={user ? "/join-newspaper" : "/login"}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm transition"
            >
              {user ? "Join with Invite Code" : "Sign In to Existing Group"}
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Tailored for Closed Communities
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Everything your editorial team needs — strictly private by design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Strict Private Access & RBAC
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Only invited members can view the issues. Role-based editorial workflows with
                distinct Readers, Proofreaders, Editors, and Administrators.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-sky-950 text-sky-400 flex items-center justify-center mb-4">
                <ToggleRight className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Dynamic Feature Modules
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Turn modules on or off with a single toggle per newspaper: Podcast player,
                calendar, reporter location map, lightbox photo frame, and PDF generator.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center mb-4">
                <FileDown className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Print-Ready PDF Layouts
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Generate clean, printer-friendly PDF issues with a single click for senior
                members, grandparents, or offline analogue reading.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-8 bg-slate-950 text-center text-xs text-slate-500">
        <p>© 2026 up2date. Built with Next.js 16, TypeScript, PostgreSQL & Prisma.</p>
      </footer>
    </div>
  );
}
