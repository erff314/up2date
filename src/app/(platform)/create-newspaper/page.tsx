"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { PlusCircle, ArrowLeft, ArrowRight, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { createNewspaperAction } from "@/app/actions/newspaper";

export default function CreateNewspaperPage() {
  const [state, formAction, isPending] = useActionState(createNewspaperAction, null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  // Helper to suggest slug based on title input
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    // Auto-generate clean slug if user hasn't explicitly customized it
    const autoSlug = newName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(autoSlug);
  };

  return (
    <div className="max-w-xl mx-auto my-6 sm:my-10">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <PlusCircle className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create a Private Newspaper
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Spin up a dedicated digital publication for your club, school class, or private community.
          </p>
        </div>

        {/* Global Error */}
        {state?.error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Creation Form */}
        <form action={formAction} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
            >
              Newspaper Title
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. FC Vorwärts Vereinszeitung"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition outline-none"
            />
            {state?.fieldErrors?.name && (
              <p className="text-xs text-rose-600 mt-1">
                {state.fieldErrors.name[0]}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="slug"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                URL Handle (Slug)
              </label>
              <span className="text-[11px] text-slate-400">
                Letters, numbers and hyphens only
              </span>
            </div>
            <div className="flex items-center rounded-lg border border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 text-sm overflow-hidden">
              <span className="px-3 py-2.5 bg-slate-100 text-slate-500 font-mono text-xs select-none border-r border-slate-300">
                up2date/
              </span>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="fc-vorwaerts"
                className="w-full px-3 py-2.5 outline-none font-mono text-xs text-slate-900"
              />
            </div>
            {state?.fieldErrors?.slug && (
              <p className="text-xs text-rose-600 mt-1">
                {state.fieldErrors.slug[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
            >
              Description / Motto (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="A short note about the purpose of this newspaper..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition outline-none resize-none"
            />
            {state?.fieldErrors?.description && (
              <p className="text-xs text-rose-600 mt-1">
                {state.fieldErrors.description[0]}
              </p>
            )}
          </div>

          {/* Info callout */}
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-start gap-2.5 text-xs text-indigo-900">
            <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <p>
              As the creator, you will automatically become the <strong>ADMIN</strong>. You will
              receive a secret invite code to share with your group members.
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Newspaper...</span>
              </>
            ) : (
              <>
                <span>Launch Newspaper</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
