import React from 'react'
import LandingPage from './LandingPage';
import AboutUs from './AboutUs';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import TeacherDashboard from '../dashboardComponents/teacherDashboardComponent/TeacherDashboard';
import Login from '../../loginSignup/Login';
import SignUp from '../../loginSignup/SignUp';
import ProtectedRouter from '../../zustand/ProtectedRouter';
import StudentDashboard from '../dashboardComponents/studentDashboardComponent/StudentDashboard';
import HomePage from '../dashboardComponents/teacherDashboardComponent/HomePage';
import AttendanceSheet from '../dashboardComponents/teacherDashboardComponent/AttendanceSheet';
import Settings from '../dashboardComponents/teacherDashboardComponent/Settings';
import CourseList from '../dashboardComponents/teacherDashboardComponent/CourseList';
import AttendanceReport from '../dashboardComponents/teacherDashboardComponent/AttendanceReport.jsx';

const Webroutes = () => {

const attendanceData = [
  { date: '2023-07-01', presentCount: 15, totalStudents: 20 },
  { date: '2023-07-02', presentCount: 18, totalStudents: 20 },
  { date: '2023-07-03', presentCount: 17, totalStudents: 20 },
  // ... more data
];
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/aboutus' element={<AboutUs />} />
        <Route path='/studentdashboard' element={<StudentDashboard/>}>
           <Route index element={<HomePage />} />
           <Route path='attendance' element={<AttendanceSheet />} />
           <Route path='courses' element={<CourseList />} />
           <Route path='reports' element={<AttendanceReport attendanceData={attendanceData} />}/>
           <Route path='settings' element={<Settings/>} />
        </Route>
          
        <Route path='/teacherdashboard' element={<ProtectedRouter><TeacherDashboard/></ProtectedRouter>}>
          <Route index element={<HomePage />} />
          <Route path='attendance' element={<AttendanceSheet />} />
          <Route path='courses' element={<CourseList />} />
          <Route path='reports' element={<AttendanceReport attendanceData={attendanceData} />}/>
          <Route path='settings' element={<Settings/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Webroutes