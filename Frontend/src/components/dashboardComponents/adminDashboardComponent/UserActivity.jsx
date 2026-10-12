import {
  BookOpen,
  CalendarCheck,
  CalendarX,
  ClipboardCheck,
  ClipboardList,
  LogIn,
  ScanFace,
  UserPlus,
} from "lucide-react";
import api from "../../../lib/api";
import useAsync from "../../../lib/useAsync";
import { dayjs } from "../../../lib/format";
import AsyncContent from "../../ui/AsyncContent";
import { EmptyState } from "../../ui/States";

const EVENT_STYLE = {
  joined: {
    icon: UserPlus,
    tile: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
  },
  signin: {
    icon: LogIn,
    tile: "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  },
  attendance: {
    icon: ScanFace,
    tile: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  },
  assignment: {
    icon: ClipboardList,
    tile: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  },
  present: {
    icon: CalendarCheck,
    tile: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  absent: {
    icon: CalendarX,
    tile: "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
  },
  submission: {
    icon: ClipboardCheck,
    tile: "bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300",
  },
};

const SUMMARY_LABELS = {
  Teacher: [
    ["subjects", "Subjects"],
    ["sessions", "Classes recorded"],
    ["assignments", "Assignments"],
  ],
  Student: [
    ["classes", "Classes"],
    ["present", "Attended"],
    ["submissions", "Submissions"],
  ],
};

const Stat = ({ label, value }) => (
  <div className="rounded-xl bg-surface-2 px-3 py-2.5">
    <p className="text-[11px] font-medium uppercase tracking-wide text-ink-3">
      {label}
    </p>
    <p className="mt-0.5 text-[20px] font-semibold tabular-nums text-ink">
      {value}
    </p>
  </div>
);

const Section = ({ title, children }) => (
  <section className="border-t border-line px-5 py-5 sm:px-6">
    <h3 className="mb-3 text-[13px] font-semibold text-ink">{title}</h3>
    {children}
  </section>
);

// Body of the admin's per-user panel: summary, subjects (teachers) and a timeline.
const UserActivity = ({ userId }) => {
  const { data, loading, error, reload } = useAsync(
    async () => (await api.get(`/users/${userId}/activity`)).data.data,
    [userId],
  );

  return (
    <AsyncContent
      loading={loading}
      error={error}
      onRetry={reload}
      bare
      errorTitle="Couldn't load activity"
      skeleton={<div className="h-64" />}
    >
      {() => {
        const { user, summary, subjects, events } = data;
        const labels = SUMMARY_LABELS[user.role] || [];
        return (
          <>
            <div className="px-5 pb-5 text-[13px] text-ink-2 sm:px-6">
              <p>
                Joined {dayjs(user.createdAt).format("MMM D, YYYY")} ·{" "}
                {user.lastLoginAt
                  ? `last signed in ${dayjs(user.lastLoginAt).format("MMM D, YYYY h:mm A")}`
                  : "no sign-in recorded yet"}
              </p>
              {labels.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {labels.map(([key, label]) => (
                    <Stat key={key} label={label} value={summary[key] ?? 0} />
                  ))}
                </div>
              )}
            </div>

            {user.role === "Teacher" && (
              <Section title="Subjects">
                {subjects.length === 0 ? (
                  <p className="text-[13px] text-ink-3">
                    No subjects yet. Assign one from the Subjects page.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {subjects.map((s) => (
                      <li
                        key={s._id}
                        className="flex items-center gap-2.5 text-[13px] text-ink"
                      >
                        <BookOpen
                          className="h-4 w-4 shrink-0 text-ink-3"
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1 truncate">
                          {s.name}
                        </span>
                        <span className="text-ink-3">
                          {s.code} · Sem {s.semester}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            )}

            <Section title="Recent activity">
              {events.length === 0 ? (
                <EmptyState title="No activity yet" compact />
              ) : (
                <ol className="space-y-3">
                  {events.map((e, i) => {
                    const style = EVENT_STYLE[e.type] || EVENT_STYLE.joined;
                    const Icon = style.icon;
                    return (
                      <li key={i} className="flex gap-3">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.tile}`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] text-ink">{e.text}</p>
                          <p className="text-xs text-ink-3">
                            {dayjs(e.date).format("MMM D, YYYY")}
                            {e.detail ? ` · ${e.detail}` : ""}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </Section>
          </>
        );
      }}
    </AsyncContent>
  );
};

export default UserActivity;
