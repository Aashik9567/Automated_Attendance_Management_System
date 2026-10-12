import { useState } from "react";
import { message } from "antd";
import { BookOpen, Plus } from "lucide-react";
import api from "../../../lib/api";
import useAsync from "../../../lib/useAsync";
import AsyncContent from "../../ui/AsyncContent";
import Button from "../../ui/Button";
import { Card, CardHeader } from "../../ui/Card";
import DataTable from "../../ui/DataTable";
import Field, { inputClass } from "../../ui/Field";
import Select from "../../ui/Select";
import { SEMESTER_OPTIONS } from "../../../lib/format";
import PageHeader from "../../ui/PageHeader";
import SidePanel from "../../ui/SidePanel";
import { EmptyState } from "../../ui/States";
import { colors as palette } from "../../ui/colors";

const EMPTY_FORM = {
  name: "",
  code: "",
  semester: "",
  creditHours: "3",
  teacher: "",
};

const loadData = async () => {
  const [subjects, users] = await Promise.all([
    api.get("/subjects"),
    api.get("/users"),
  ]);
  return {
    subjects: subjects.data.data,
    teachers: users.data.data.filter((u) => u.role === "Teacher"),
  };
};

const TeacherSelect = ({ teachers, ...props }) => (
  <Select
    placeholder="Choose a teacher"
    searchable={teachers.length > 6}
    options={teachers.map((t) => ({ value: t._id, label: t.fullName, description: t.email }))}
    {...props}
  />
);

const AdminSubjects = () => {
  const { data, loading, error, reload, setData } = useAsync(loadData);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [assigning, setAssigning] = useState(null);
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const shown = (data?.subjects || []).filter(
    (s) =>
      (semesterFilter === "all" || String(s.semester) === semesterFilter) &&
      (teacherFilter === "all" || (s.teacher?._id || "") === teacherFilter),
  );

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const replaceSubject = (subject) =>
    setData((d) => ({
      ...d,
      subjects: d.subjects.map((s) => (s._id === subject._id ? subject : s)),
    }));

  const assignTeacher = async (subject, teacherId) => {
    setAssigning(subject._id);
    try {
      const { data: res } = await api.patch(
        `/subjects/${subject._id}/teacher`,
        { teacher: teacherId },
      );
      replaceSubject(res.data);
      message.success(
        `${subject.name} assigned to ${res.data.teacher.fullName}`,
      );
    } catch (err) {
      message.error(
        err.response?.data?.message || "Couldn't assign the subject",
      );
    } finally {
      setAssigning(null);
    }
  };

  const createSubject = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: created } = await api.post("/subjects", {
        ...form,
        semester: Number(form.semester),
        creditHours: Number(form.creditHours),
      });
      const teacher = data.teachers.find((t) => t._id === created.teacher);
      setData((d) => ({
        ...d,
        subjects: [{ ...created, teacher }, ...d.subjects],
      }));
      message.success(`${created.name} created`);
      setForm(EMPTY_FORM);
      setOpen(false);
    } catch (err) {
      message.error(
        err.response?.data?.message || "Couldn't create the subject",
      );
    } finally {
      setSaving(false);
    }
  };

  const columns = (teachers) => [
    {
      key: "name",
      header: "Subject",
      sortValue: (s) => s.name.toLowerCase(),
      render: (s) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{s.name}</p>
          <p className="text-xs text-ink-3">{s.code}</p>
        </div>
      ),
    },
    {
      key: "semester",
      header: "Semester",
      sortValue: (s) => s.semester,
      render: (s) => `Semester ${s.semester}`,
    },
    {
      key: "credits",
      header: "Credits",
      align: "right",
      sortValue: (s) => s.creditHours,
      render: (s) => s.creditHours,
    },
    {
      key: "teacher",
      header: "Teacher",
      sortValue: (s) => s.teacher?.fullName || "",
      className: "w-[280px]",
      render: (s) => (
        <TeacherSelect
          teachers={teachers}
          value={s.teacher?._id || ""}
          disabled={assigning === s._id}
          aria-label={`Teacher for ${s.name}`}
          onChange={(teacherId) =>
            teacherId !== s.teacher?._id && assignTeacher(s, teacherId)
          }
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        icon={BookOpen}
        color="indigo"
        title="Subjects"
        description="Every subject and who teaches it. Change the teacher to reassign a subject."
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setOpen(true)}>
            Add subject
          </Button>
        }
      />

      <AsyncContent
        loading={loading}
        error={error}
        onRetry={reload}
        skeleton={<Card className="h-80" />}
        errorTitle="Couldn't load subjects"
      >
        {() => (
          <Card>
            <CardHeader
              icon={BookOpen}
              iconTile={palette.indigo.tile}
              title="All subjects"
              description={`${data.subjects.length} subjects · ${data.teachers.length} teachers`}
            />
            <DataTable
              columns={columns(data.teachers)}
              rows={shown}
              toolbar={
                <>
                  <Select
                    size="sm"
                    className="w-40"
                    aria-label="Filter by semester"
                    value={semesterFilter}
                    onChange={setSemesterFilter}
                    options={[{ value: "all", label: "All semesters" }, ...SEMESTER_OPTIONS]}
                  />
                  <Select
                    size="sm"
                    className="w-48"
                    aria-label="Filter by teacher"
                    value={teacherFilter}
                    onChange={setTeacherFilter}
                    options={[{ value: "all", label: "All teachers" }, ...data.teachers.map((t) => ({ value: t._id, label: t.fullName }))]}
                  />
                </>
              }
              initialSort={{ key: "semester", dir: "asc" }}
              search={{
                placeholder: "Search by subject, code or teacher",
                getText: (s) =>
                  `${s.name} ${s.code} ${s.teacher?.fullName || ""}`,
              }}
              empty={
                <EmptyState
                  icon={BookOpen}
                  title="No subjects yet"
                  description="Add one and assign a teacher."
                  compact
                />
              }
            />
          </Card>
        )}
      </AsyncContent>

      <SidePanel
        open={open}
        onClose={() => setOpen(false)}
        label="Add subject"
        header={
          <div>
            <h2 className="text-[19px] font-semibold tracking-tight text-ink">
              Add subject
            </h2>
            <p className="mt-1 text-sm text-ink-2">
              Students of the chosen semester are enrolled automatically.
            </p>
          </div>
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              type="submit"
              form="add-subject"
              loading={saving}
            >
              Create subject
            </Button>
          </div>
        }
      >
        <form
          id="add-subject"
          onSubmit={createSubject}
          className="space-y-4 p-5 sm:p-6"
        >
          <Field label="Name">
            {(p) => (
              <input
                {...p}
                required
                value={form.name}
                onChange={set("name")}
                className={inputClass}
              />
            )}
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Code">
              {(p) => (
                <input
                  {...p}
                  required
                  value={form.code}
                  onChange={set("code")}
                  placeholder="CN801"
                  className={inputClass}
                />
              )}
            </Field>
            <Field label="Credit hours">
              {(p) => (
                <input
                  {...p}
                  required
                  type="number"
                  min={1}
                  max={10}
                  value={form.creditHours}
                  onChange={set("creditHours")}
                  className={inputClass}
                />
              )}
            </Field>
          </div>
          <Field label="Semester">
            {(p) => (
              <Select
                {...p}
                required
                placeholder="Select semester"
                value={form.semester}
                onChange={(semester) => setForm((f) => ({ ...f, semester }))}
                options={SEMESTER_OPTIONS}
              />
            )}
          </Field>
          <Field
            label="Teacher"
            hint={
              data?.teachers.length === 0
                ? "Create a teacher account first."
                : undefined
            }
          >
            {(p) => (
              <TeacherSelect
                {...p}
                required
                teachers={data?.teachers || []}
                value={form.teacher}
                onChange={(teacher) => setForm((f) => ({ ...f, teacher }))}
              />
            )}
          </Field>
        </form>
      </SidePanel>
    </div>
  );
};

export default AdminSubjects;
