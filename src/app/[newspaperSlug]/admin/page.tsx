import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Settings,
  ShieldCheck,
  ToggleRight,
  Users,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Save,
  Headphones,
  Calendar,
  MapPin,
  FileDown,
  Images,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { requireNewspaperRole } from "@/lib/auth";
import { updateModuleConfigAction, updateMemberRoleAction } from "@/app/actions/admin";

export const instant = false;

export default async function TenantAdminPage({
  params,
}: {
  params: Promise<{ newspaperSlug: string }>;
}) {
  const { newspaperSlug } = await params;
  const { user } = await requireNewspaperRole(newspaperSlug, ["ADMIN"]);

  // Fetch full newspaper data
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
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  if (!newspaper) {
    notFound();
  }

  const config = newspaper.moduleConfig;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Admin Top Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${newspaper.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Issue</span>
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-600" />
              <span>{newspaper.name} — Admin Console</span>
            </h1>
          </div>

          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
            Administrator: {user.name}
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* SECTION 1: Secret Invite Code & Onboarding (FORM-01 / FORM-04) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Access Control
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                Private Group Invite Management
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Anyone with this code can join &quot;{newspaper.name}&quot; as a member.
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Secret Invite Code
              </span>
              <code className="text-xl font-mono font-extrabold text-indigo-600 tracking-wider">
                {newspaper.inviteCode}
              </code>
            </div>

            <div className="text-xs text-slate-500 max-w-sm text-center sm:text-right">
              Members can go to{" "}
              <Link href="/join-newspaper" className="font-semibold text-indigo-600 underline">
                /join-newspaper
              </Link>{" "}
              and enter this code to gain instant reading access.
            </div>
          </div>
        </div>

        {/* SECTION 2: Dynamic Feature Module Toggles (FORM-04 Matrix) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                FORM-04 Feature Matrix
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                Dynamic Module ON/OFF Toggles
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Configure which modular components are active for your private newspaper.
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
              <ToggleRight className="w-5 h-5" />
            </div>
          </div>

          <form action={updateModuleConfigAction} className="space-y-4">
            <input type="hidden" name="newspaperSlug" value={newspaper.slug} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Podcast Module */}
              <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="hasPodcast"
                  defaultChecked={config?.hasPodcast ?? true}
                  className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                    <Headphones className="w-4 h-4 text-indigo-600" />
                    <span>Podcast Player & Archive (FORM-05)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Audio player for the latest episode + dedicated episode repository.
                  </p>
                </div>
              </label>

              {/* Event Calendar */}
              <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="hasCalendar"
                  defaultChecked={config?.hasCalendar ?? true}
                  className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>Event Calendar (FORM-07)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Interactive monthly schedule with deadlines, member birthdays, and team events.
                  </p>
                </div>
              </label>

              {/* Reporter Map */}
              <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="hasMap"
                  defaultChecked={config?.hasMap ?? true}
                  className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Live Reporter Map</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Interactive OpenStreetMap with local team locations and contact pins.
                  </p>
                </div>
              </label>

              {/* PDF Print Generator */}
              <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="hasPdfExport"
                  defaultChecked={config?.hasPdfExport ?? true}
                  className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                    <FileDown className="w-4 h-4 text-rose-600" />
                    <span>PDF Print Generator</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Printer-optimized layout (@media print) for analogue and senior readers.
                  </p>
                </div>
              </label>

              {/* Photo Frame & Gallery */}
              <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="hasGallery"
                  defaultChecked={config?.hasGallery ?? true}
                  className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                    <Images className="w-4 h-4 text-purple-600" />
                    <span>Photo Frame & Lightbox Gallery</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hero image frame linked to dedicated community gallery lightbox.
                  </p>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Module Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 3: Member Roster & Scoped Roles */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Team Management
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                Member Roster ({newspaper.members.length})
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Assign editorial permissions: Reader, Proofreader, Editor, or Admin.
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Role Assignment</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {newspaper.members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {member.user.name}
                      {member.userId === user.id && (
                        <span className="ml-1.5 text-[10px] text-slate-400 font-normal">
                          (You)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {member.user.email}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <form
                        action={updateMemberRoleAction}
                        id={`form-${member.id}`}
                        className="flex items-center gap-2"
                      >
                        <input type="hidden" name="newspaperSlug" value={newspaper.slug} />
                        <input type="hidden" name="memberId" value={member.id} />
                        <select
                          name="role"
                          defaultValue={member.role}
                          className="px-2.5 py-1.5 rounded-md border border-slate-300 bg-white font-medium text-xs focus:border-indigo-500 outline-none"
                        >
                          <option value="READER">READER (Read & Comment)</option>
                          <option value="PROOFREADER">PROOFREADER (Review & Notes)</option>
                          <option value="EDITOR">EDITOR (Draft & Publish)</option>
                          <option value="ADMIN">ADMIN (Full Control)</option>
                        </select>
                      </form>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="submit"
                        form={`form-${member.id}`}
                        className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
