import React from 'react'

const Holiday = () => {
  return (
    <div className="p-6 rounded-lg shadow-md bg-gradient-to-br from-blue-200 to-indigo-300">
    <h3 className="mb-4 text-xl font-semibold">Upcoming Holidays</h3>
    <table className="min-w-full">
      <thead>
        <tr className="bg-stone-300">
          <th className="p-2 text-left">Date</th>
          <th className="p-2 text-left">Holiday</th>
          <th className="p-2 text-left">Type</th>
        </tr>
      </thead>
      <tbody>
        {[
          { date: '2024-12-25', name: 'Christmas Day', type: 'Public Holiday' },
          { date: '2025-01-01', name: 'New Year\'s Day', type: 'Public Holiday' },
          { date: '2025-01-26', name: 'Republic Day', type: 'National Holiday' },
          { date: '2025-03-21', name: 'Holi', type: 'Festival' },
        ].map((holiday, index) => (
          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
            <td className="p-2">{holiday.date}</td>
            <td className="p-2">{holiday.name}</td>
            <td className="p-2">{holiday.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default Holiday
