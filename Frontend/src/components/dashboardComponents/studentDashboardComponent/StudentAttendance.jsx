import React from 'react'

const StudentAttendance = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
    <h3 className="mb-4 text-xl font-semibold">Attendance Sheet</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Subject</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {[
            { date: '2024-07-15', subject: 'Mathematics', status: 'Present' },
            { date: '2024-07-14', subject: 'Physics', status: 'Absent' },
            { date: '2024-07-13', subject: 'Computer Science', status: 'Present' },
            { date: '2024-07-12', subject: 'Literature', status: 'Present' },
            { date: '2024-07-11', subject: 'Mathematics', status: 'Absent' },
          ].map((record, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="p-2">{record.date}</td>
              <td className="p-2">{record.subject}</td>
              <td className={`p-2 ${record.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                {record.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default StudentAttendance
