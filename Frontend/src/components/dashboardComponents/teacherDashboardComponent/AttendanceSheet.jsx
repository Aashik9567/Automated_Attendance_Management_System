import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useDisclosure,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

const AttendanceSheet = () => {
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: 'Aashik Kumar Mahato', present: true },
    { id: 2, name: 'Bhawana Adhikari', present: false },
    { id: 3, name: 'Mandeep Kumar Mishra', present: true },
    { id: 4, name: 'Rensa Neupane', present: true },
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newStudentName, setNewStudentName] = useState('');

  const handleAttendanceChange = (id) => {
    setAttendanceData(attendanceData.map(student => 
      student.id === id ? {...student, present: !student.present} : student
    ));
  };

  const handleDateChange = (e) => {
    setAttendanceDate(e.target.value);
  };

  const handleAddStudent = () => {
    if (newStudentName.trim()) {
      setAttendanceData([...attendanceData, {
        id: attendanceData.length + 1,
        name: newStudentName.trim(),
        present: false
      }]);
      setNewStudentName('');
      onClose();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="date"
          value={attendanceDate}
          onChange={handleDateChange}
          className="border rounded px-2 py-1"
        />
        <Button colorScheme="blue" onClick={onOpen}>Add Student</Button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {attendanceData.map(student => (
            <tr key={student.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
              <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  student.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {student.present ? 'Present' : 'Absent'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button 
                  onClick={() => handleAttendanceChange(student.id)}
                  className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out"
                >
                  Change
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Student</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Student Name</FormLabel>
              <Input 
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Enter student name"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddStudent}>
              Add
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AttendanceSheet;