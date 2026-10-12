import Select from "../ui/Select";
import { titleCase } from "../../lib/format";

// Subject picker shared by Take attendance and Reports. A value that isn't in
// the list yet (e.g. from ?subject= while subjects load) stays hidden rather
// than flashing a raw id.
const SubjectSelect = ({ subjects, value, onChange, loading = false, id, className = "", placeholder = "Choose a subject" }) => {
  const known = subjects.some((s) => s._id === value);
  return (
    <Select
      id={id}
      aria-label={id ? undefined : "Subject"}
      size="control"
      value={known ? value : undefined}
      onChange={onChange}
      loading={loading}
      disabled={loading && !subjects.length}
      placeholder={loading ? "Loading subjects…" : placeholder}
      className={`w-full ${className}`}
      searchable={subjects.length > 6}
      emptyText="No subjects"
      options={subjects.map((s) => ({ value: s._id, label: titleCase(s.name), description: s.code }))}
    />
  );
};

export default SubjectSelect;
