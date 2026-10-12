import { useState } from "react";
import { Modal, message } from "antd";
import { Trash2, UserPlus, Users } from "lucide-react";
import api from "../../../lib/api";
import useAsync from "../../../lib/useAsync";
import { dayjs } from "../../../lib/format";
import Avatar from "../../ui/Avatar";
import Button from "../../ui/Button";
import { Card, CardHeader } from "../../ui/Card";
import DataTable from "../../ui/DataTable";
import Field, { inputClass } from "../../ui/Field";
import PageHeader from "../../ui/PageHeader";
import SidePanel from "../../ui/SidePanel";
import StatusBadge from "../../ui/StatusBadge";
import AsyncContent from "../../ui/AsyncContent";
import { EmptyState } from "../../ui/States";
import { colors as palette } from "../../ui/colors";

const ROLE_COLOR = { Admin: "rose", Teacher: "indigo", Student: "emerald" };
const EMPTY_FORM = { fullName: "", email: "", semester: "", password: "" };

// What else goes away with the account (mirrors DELETE /users/:id).
const DELETE_NOTE = {
  Student: "Their enrollments, attendance entries and assignment submissions will be removed.",
  Teacher: "Their subjects will be removed, along with all attendance records, assignments and student enrollments for those subjects.",
};

const baseColumns = [
  {
    key: "name",
    header: "Name",
    sortValue: (u) => u.fullName.toLowerCase(),
    render: (u) => (
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={u.fullName} src={u.avatar} size="sm" />
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{u.fullName}</p>
          <p className="truncate text-xs text-ink-3">{u.email}</p>
        </div>
      </div>
    ),
  },
  { key: "role", header: "Role", sortValue: (u) => u.role, render: (u) => <StatusBadge color={ROLE_COLOR[u.role]}>{u.role}</StatusBadge> },
  { key: "semester", header: "Semester", align: "right", sortValue: (u) => u.semester || 0, render: (u) => u.semester ?? "—" },
  { key: "joined", header: "Joined", align: "right", sortValue: (u) => u.createdAt, render: (u) => dayjs(u.createdAt).format("MMM D, YYYY") },
];

const AdminAccounts = () => {
  const { data: users, loading, error, reload, setData } = useAsync(async () => (await api.get("/users")).data.data);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      const { data } = await api.delete(`/users/${toDelete._id}`);
      setData((list) => list.filter((u) => u._id !== toDelete._id));
      message.success(data.message);
      setToDelete(null);
    } catch (err) {
      message.error(err.response?.data?.message || "Couldn't delete the account");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    ...baseColumns,
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      align: "right",
      render: (u) =>
        u.role !== "Admin" && (
          <Button
            size="icon-sm"
            variant="ghost"
            icon={Trash2}
            aria-label={`Delete ${u.fullName}`}
            onClick={() => setToDelete(u)}
            className="hover:!bg-danger/10 hover:!text-danger"
          />
        ),
    },
  ];

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const createTeacher = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post("/users/teachers", { ...form, semester: Number(form.semester) });
      setData((list) => [data.data, ...(list || [])]);
      message.success(`Teacher account created for ${data.data.fullName}`);
      setForm(EMPTY_FORM);
      setOpen(false);
    } catch (err) {
      message.error(err.response?.data?.message || "Couldn't create the account");
    } finally {
      setSaving(false);
    }
  };

  const count = (role) => (users || []).filter((u) => u.role === role).length;

  return (
    <div className="space-y-4">
      <PageHeader
        icon={Users}
        color="rose"
        title="Accounts"
        description="Everyone who can sign in. Teacher accounts are created here; students sign up themselves."
        actions={
          <Button variant="primary" icon={UserPlus} onClick={() => setOpen(true)}>
            Add teacher
          </Button>
        }
      />

      <AsyncContent loading={loading} error={error} onRetry={reload} skeleton={<Card className="h-80" />} errorTitle="Couldn't load accounts">
        {() => (
          <Card>
            <CardHeader
              icon={Users}
              iconTile={palette.rose.tile}
              title="All accounts"
              description={`${count("Teacher")} teachers · ${count("Student")} students · ${count("Admin")} admin`}
            />
            <DataTable
              columns={columns}
              rows={users}
              initialSort={{ key: "joined", dir: "desc" }}
              search={{ placeholder: "Search by name or email", getText: (u) => `${u.fullName} ${u.email}` }}
              empty={<EmptyState icon={Users} title="No accounts yet" compact />}
            />
          </Card>
        )}
      </AsyncContent>

      <Modal title="Delete account?" open={!!toDelete} onCancel={() => setToDelete(null)} footer={null} width={440}>
        <p className="text-sm text-ink-2">
          {toDelete?.fullName} ({toDelete?.email}) will no longer be able to sign in. {DELETE_NOTE[toDelete?.role]} This can&apos;t be
          undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button variant="danger" icon={Trash2} loading={deleting} onClick={deleteAccount}>
            Delete account
          </Button>
        </div>
      </Modal>

      <SidePanel
        open={open}
        onClose={() => setOpen(false)}
        label="Add teacher"
        accent="from-rose-50 via-indigo-50/60 to-transparent"
        header={
          <div>
            <h2 className="text-[19px] font-semibold tracking-tight text-ink">Add teacher</h2>
            <p className="mt-1 text-sm text-ink-2">They sign in with this email and password, then can change their details in Settings.</p>
          </div>
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" form="add-teacher" loading={saving}>
              Create account
            </Button>
          </div>
        }
      >
        <form id="add-teacher" onSubmit={createTeacher} className="space-y-4 p-5 sm:p-6">
          <Field label="Full name">
            {(p) => <input {...p} required autoComplete="off" value={form.fullName} onChange={set("fullName")} className={inputClass} />}
          </Field>
          <Field label="Email">
            {(p) => <input {...p} required type="email" autoComplete="off" value={form.email} onChange={set("email")} className={inputClass} />}
          </Field>
          <Field label="Semester" hint="The semester this teacher mainly teaches.">
            {(p) => (
              <select {...p} required value={form.semester} onChange={set("semester")} className={inputClass}>
                <option value="" disabled>
                  Select semester
                </option>
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Semester {i + 1}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Temporary password" hint="At least 8 characters. Share it with the teacher privately.">
            {(p) => (
              <input {...p} required minLength={8} type="password" autoComplete="new-password" value={form.password} onChange={set("password")} className={inputClass} />
            )}
          </Field>
        </form>
      </SidePanel>
    </div>
  );
};

export default AdminAccounts;
