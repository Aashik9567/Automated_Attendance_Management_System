import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react'

const CourseList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [courses, setCourses] = useState([
    { id: 1, name: 'Advanced Electronics', code: 'EX 707', students: 35 },
    { id: 2, name: 'Digital Signal Processing', code: 'EX 703', students: 40 },
    { id: 3, name: 'Computer Networks', code: 'EX 705', students: 38 },
  ])

  const [newCourse, setNewCourse] = useState({ id: '', name: '', code: '', students: '' })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewCourse({ ...newCourse, [name]: value })
  }

  const handleAddCourse = () => {
    setCourses([...courses, { ...newCourse, id: parseInt(newCourse.id), students: parseInt(newCourse.students) }])
    setNewCourse({ id: '', name: '', code: '', students: '' })
    onClose()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <h3 className="text-lg mb-4 font-extrabold">Your Courses</h3>
      <ul className="space-y-2">
        {courses.map(course => (
          <li key={course.id} className="flex justify-between items-center">
            <div>
              <span className="font-medium">{course.name}</span>
              <span className="text-sm text-gray-500 ml-2">{course.code}</span>
            </div>
            <span className="text-sm text-blue-500">{course.students} students</span>
          </li>
        ))}
      </ul>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new course</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>ID</FormLabel>
              <Input name="id" value={newCourse.id} onChange={handleInputChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Name</FormLabel>
              <Input name="name" value={newCourse.name} onChange={handleInputChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Code</FormLabel>
              <Input name="code" value={newCourse.code} onChange={handleInputChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Students</FormLabel>
              <Input name="students" value={newCourse.students} onChange={handleInputChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleAddCourse}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <button onClick={onOpen} className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
        Add New Course
      </button>
    </div>
  );
};

export default CourseList;