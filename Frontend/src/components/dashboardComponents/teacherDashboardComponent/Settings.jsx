import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  Divider,
  Avatar,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { FaCamera } from 'react-icons/fa';
import store from '../../../zustand/loginStore';

const Settings = () => {
    const { isLogin, loginUserData } = store(state => state)
  const toast = useToast();

  const handleSaveChanges = () => {
    // Logic to save changes would go here
    toast({
      title: "Settings saved.",
      description: "Your changes have been successfully saved.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box bg="white" shadow="xl" rounded="lg" p={6}>
      <Heading size="lg" mb={6}>Account Settings</Heading>
      
      <VStack spacing={8} align="stretch">
        {/* Profile Information */}
        <Box>
          <Heading size="md" mb={4}>Profile Information</Heading>
          <Flex alignItems="center" mb={4}>
            <Avatar size="xl" src={loginUserData.avatar} mr={4} />
            <IconButton
              aria-label="Change profile picture"
              icon={<FaCamera />}
              isRound
              onClick={() => {/* Logic to change profile picture */}}
            />
          </Flex>
          <SimpleGrid columns={2} spacing={4}>
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input placeholder="John" />
            </FormControl>
            <FormControl>
              <FormLabel>Email Address</FormLabel>
              <Input placeholder="aashik.077@example.com" type="email" />
            </FormControl>
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input placeholder="+977980000000" type="tel" />
            </FormControl>
          </SimpleGrid>
        </Box>

        <Divider />

        {/* Account Security */}
        <Box>
          <Heading size="md" mb={4}>Account Security</Heading>
          <VStack align="stretch" spacing={4}>
            <FormControl>
              <FormLabel>Change Password</FormLabel>
              <Input placeholder="New password" type="password" mb={2} />
              <Input placeholder="Confirm new password" type="password" />
            </FormControl>
            <FormControl>
              <FormLabel>Two-Factor Authentication</FormLabel>
              <Select placeholder="Select option">
                <option value="disabled">Disabled</option>
                <option value="sms">SMS</option>
                <option value="app">Authenticator App</option>
              </Select>
            </FormControl>
          </VStack>
        </Box>

        <Divider />

        {/* Teaching Preferences */}
        <Box>
          <Heading size="md" mb={4}>Teaching Preferences</Heading>
          <SimpleGrid columns={2} spacing={4}>
            <FormControl>
              <FormLabel>Preferred Teaching Mode</FormLabel>
              <Select placeholder="Select mode">
                <option value="in-person">In-person</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Class Size Preference</FormLabel>
              <Select placeholder="Select size">
                <option value="small">Small (1-15 students)</option>
                <option value="medium">Medium (16-30 students)</option>
                <option value="large">Large (31+ students)</option>
              </Select>
            </FormControl>
          </SimpleGrid>
        </Box>

        {/* Save Changes Button */}
        <Button colorScheme="blue" size="lg" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
};

export default Settings;