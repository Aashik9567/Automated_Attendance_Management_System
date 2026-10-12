import { Subject } from "../models/subject.model.js";
import { apiError } from "./errorHandler.js";

// Teachers may only manage attendance and assignments for subjects they teach.
export const findOwnedSubject = async (subjectId, user) => {
    const subject = await Subject.findById(subjectId);
    if (!subject) throw new apiError(404, "Subject not found");
    if (!subject.teacher.equals(user._id)) {
        throw new apiError(403, "You can only manage subjects you teach");
    }
    return subject;
};
