import React from "react";

const CourseDetail = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="mb-4 text-xl font-semibold">
        Your Courses Completion data
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { name: "Mathematics", code: "MATH101", progress: 75 },
          { name: "Computer Science", code: "CS201", progress: 60 },
          { name: "Physics", code: "PHY301", progress: 80 },
          { name: "Literature", code: "LIT401", progress: 90 },
        ].map((course, index) => (
          <div
            key={index}
            className="p-4 transition-shadow border rounded-lg hover:shadow-md"
          >
            <h4 className="text-lg font-semibold">{course.name}</h4>
            <p className="mb-2 text-sm text-gray-600">
              Course Code: {course.code}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-right">{course.progress}% Complete</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;
