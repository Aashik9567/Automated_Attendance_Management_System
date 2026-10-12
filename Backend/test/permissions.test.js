// Permission and input rules that must not regress. No database needed:
// the model calls each test reaches are stubbed.  Run: npm test
import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { Subject } from "../src/models/subject.model.js";
import { Attendance } from "../src/models/attendance.model.js";
import { Assignment } from "../src/models/assignment.model.js";
import { StudentSubject } from "../src/models/studentSubject.model.js";
import { signupUser, deleteUser } from "../src/controllers/user.controller.js";
import { User } from "../src/models/user.model.js";
import { markAttendance, getAttendanceBySubject, getStudentAttendance } from "../src/controllers/attendance.controller.js";
import { getAssignments } from "../src/controllers/assignment.controller.js";
import { restrictTo } from "../src/middlewares/roleCheck.middleware.js";
import { healthCheck } from "../src/controllers/health.controller.js";

const id = () => new mongoose.Types.ObjectId();
const teacher = { _id: id(), role: "Teacher" };
const student = { _id: id(), role: "Student" };

const fakeRes = () => ({
  statusCode: 200,
  body: undefined,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
});

const run = async (handler, req) => {
  const res = fakeRes();
  await handler({ body: {}, params: {}, query: {}, method: "TEST", originalUrl: "/test", ...req }, res, () => {});
  return res;
};

const originals = [];
const stub = (obj, key, fn) => { originals.push([obj, key, obj[key]]); obj[key] = fn; };
afterEach(() => { for (const [obj, key, fn] of originals.splice(0).reverse()) obj[key] = fn; });

test("public sign-up cannot create a teacher account", async () => {
  const res = await run(signupUser, { body: { role: "Teacher", fullName: "Mallory", email: "m@x.edu", password: "password123", semester: 8 } });
  assert.equal(res.statusCode, 403);
});

test("sign-up rejects passwords shorter than 8 characters", async () => {
  const res = await run(signupUser, { body: { fullName: "Sam", email: "s@x.edu", password: "short", semester: 8 } });
  assert.equal(res.statusCode, 400);
});

test("a teacher cannot mark attendance for another teacher's subject", async () => {
  stub(Subject, "findById", async () => ({ teacher: id() }));
  stub(Attendance, "create", async () => assert.fail("must not save"));
  const res = await run(markAttendance, {
    user: teacher,
    body: { subjectId: id(), students: [{ student: student._id, status: "present" }] },
  });
  assert.equal(res.statusCode, 403);
});

test("a teacher cannot read another teacher's class attendance", async () => {
  stub(Subject, "findById", async () => ({ teacher: id() }));
  const res = await run(getAttendanceBySubject, { user: teacher, params: { subjectId: id() } });
  assert.equal(res.statusCode, 403);
});

test("students are blocked from teacher-only routes", () => {
  assert.throws(() => restrictTo("Teacher")({ user: student }, {}, () => {}), { statusCode: 403 });
});

test("a student's attendance only includes their own entry", async () => {
  let projection;
  stub(Attendance, "find", (filter, proj) => {
    projection = proj;
    return { populate: async () => [] };
  });
  await run(getStudentAttendance, { user: student });
  assert.deepEqual(projection.students, { $elemMatch: { student: student._id } });
});

test("students only see their own assignment submissions", async () => {
  const mine = { student: student._id, grade: 90 };
  const theirs = { student: id(), grade: 40 };
  const doc = { toObject: () => ({ title: "Lab 1", submissions: [mine, theirs] }) };
  stub(Assignment, "find", () => ({ populate() { return this; }, sort: async () => [doc] }));
  const res = await run(getAssignments, { user: student });
  assert.deepEqual(res.body.data[0].submissions, [mine]);
});

test("admin accounts cannot be deleted", async () => {
  stub(User, "findById", async () => ({ _id: id(), role: "Admin", deleteOne: () => assert.fail("must not delete") }));
  const res = await run(deleteUser, { user: { _id: id(), role: "Admin" }, params: { id: id() } });
  assert.equal(res.statusCode, 403);
});

test("deleting a student removes them from attendance and submissions", async () => {
  const studentId = id();
  const pulls = [];
  stub(User, "findById", async () => ({ _id: studentId, role: "Student", fullName: "Sam", deleteOne: async () => {} }));
  stub(StudentSubject, "deleteMany", async () => {});
  stub(Attendance, "updateMany", async (filter, update) => pulls.push(update.$pull.students.student));
  stub(Assignment, "updateMany", async (filter, update) => pulls.push(update.$pull.submissions.student));
  const res = await run(deleteUser, { user: { _id: id(), role: "Admin" }, params: { id: studentId } });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(pulls, [studentId, studentId]);
});

test("assignment search treats regex characters as plain text", async () => {
  let filter;
  stub(Assignment, "find", (q) => { filter = q; return { populate() { return this; }, sort: async () => [] }; });
  const res = await run(getAssignments, { user: teacher, query: { search: "lab[1" } });
  assert.equal(res.statusCode, 200);
  assert.equal(filter.title.$regex, "lab\\[1");
});

test("health check answers 200 without touching the database", async () => {
  stub(User, "findById", () => assert.fail("must not query"));
  const res = await run(healthCheck, {});
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.ok(!Number.isNaN(Date.parse(res.body.timestamp)));
});
