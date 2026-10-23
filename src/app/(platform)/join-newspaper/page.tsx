"use client";

import { useActionState } from "react";
import Link from "next/link";
import { KeyRound, ArrowLeft, ArrowRight, AlertCircle, Loader2, Users } from "lucide-react";
import { joinNewspaperAction } from "@/app/actions/newspaper";

export default function JoinNewspaperPage() {
  const [state, formAction, isPending] = useActionState(joinNewspaperAction, null);

  return (
    <div className="max-w-md mx-auto my-8 sm:my-12">
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
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Join a Newspaper
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter the private invite code given to you by your newspaper administrator.
          </p>
        </div>

        {/* Global Error Banner */}
        {state?.error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Join Form */}
        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="inviteCode"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
            >
              Secret Invite Code
            </label>
            <input
              id="inviteCode"
              name="inviteCode"
              type="text"
              required
              placeholder="e.g. FCV-A98B2"
              className="w-full px-3.5 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-center font-mono font-bold tracking-wider text-base uppercase transition outline-none"
            />
            {state?.fieldErrors?.inviteCode && (
              <p className="text-xs text-rose-600 mt-1 text-center">
                {state.fieldErrors.inviteCode[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking Code...</span>
              </>
            ) : (
              <>
                <span>Join as Reader</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Do not have an invite code? Ask your club leader or administrator to share their
            newspaper invite code with you.
          </p>
        </div>
      </div>
    </div>
  );
}
