import React from 'react';
import {
  Box,
  Flex,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { FaUserGraduate, FaChalkboardTeacher, FaBookReader } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const StudentStats = () => {
  const attendanceData = [
    { name: 'Present', value: 85 },
    { name: 'Absent', value: 15 },
  ];
  const COLORS = ['#48BB78', '#F56565'];

  return (
    <Box bg="white" shadow="xl" rounded="lg" p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Student Statistics
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box>
          <Flex justify="space-between" mb={4}>
            <Stat>
              <StatLabel>Total Students</StatLabel>
              <StatNumber>120</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                5.36%
              </StatHelpText>
            </Stat>
            <Icon as={FaUserGraduate} w={12} h={12} color="blue.500" />
          </Flex>
          <Flex justify="space-between" mb={4}>
            <Stat>
              <StatLabel>Average Attendance</StatLabel>
              <StatNumber>85%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                2.1%
              </StatHelpText>
            </Stat>
            <Icon as={FaChalkboardTeacher} w={12} h={12} color="green.500" />
          </Flex>
          <Flex justify="space-between">
            <Stat>
              <StatLabel>Students at Risk</StatLabel>
              <StatNumber color="red.500">5</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                1.2%
              </StatHelpText>
            </Stat>
            <Icon as={FaBookReader} w={12} h={12} color="red.500" />
          </Flex>
        </Box>
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={2}>
            Attendance Overview
          </Text>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <Flex justify="center" mt={2}>
            {attendanceData.map((entry, index) => (
              <Box key={entry.name} mx={2}>
                <Flex align="center">
                  <Box w={3} h={3} bg={COLORS[index]} mr={1} />
                  <Text fontSize="sm">{entry.name}: {entry.value}%</Text>
                </Flex>
              </Box>
            ))}
          </Flex>
        </Box>
      </SimpleGrid>
      
    </Box>
  );
};

export default StudentStats;