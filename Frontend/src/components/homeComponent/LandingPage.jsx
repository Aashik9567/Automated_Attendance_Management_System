import React, { useEffect } from 'react';
import { FaUserCheck, FaChartBar, FaClock, FaMobileAlt } from 'react-icons/fa';
import logo from '../../assets/Logo.png';
import { Link } from 'react-router-dom';
import { ReactTyped } from "react-typed";
const LandingPage = () => {
  return (
    <div className="min-h-screen text-white bg-gradient-to-r from-blue-500 to-indigo-400">
      {/* Header */}
      <header className="container px-4 py-4 mx-auto sm:py-4">
        <nav className="flex items-center justify-between">
        <div className="mb-4 text-center md:mb-8">
                    <img className="w-[86px] h-[70px] inline-block mr-2" src={logo} alt="logo" />
                    <span className="text-2xl font-semibold">AAMS</span>
         </div>
         <Link to={'/teacherdashboard'}><button className="px-3 py-1 text-sm font-semibold text-purple-600 transition duration-300 bg-white rounded-full sm:px-4 sm:py-2 sm:text-base hover:bg-purple-100">
             Veiw Dashboard
        </button></Link> 
     <div>
     <Link to={'/login'}><button className="px-3 py-1 text-sm font-semibold text-purple-600 transition duration-300 bg-white rounded-full sm:px-4 sm:py-2 sm:text-base hover:bg-purple-100">
             Login
        </button></Link> 
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container px-4 mx-auto mt-8 text-center sm:mt-12">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl sm:mb-6">
          <ReactTyped strings={["Automated Attendance Management System"]} typeSpeed={70} onComplete={(self) => self.cursor.remove()}/>
        </h2>
        <p className="max-w-2xl mx-auto mb-6 text-lg sm:text-xl sm:mb-8">
        Streamline attendance with our advanced face recognition system, boosting efficiency and providing valuable insights.  </p>
        <button className="px-4 py-2 text-base font-semibold text-purple-600 transition duration-300 bg-white rounded-full sm:px-6 sm:py-3 sm:text-lg hover:bg-purple-100">
         <Link to={'/aboutus'} >More About Us </Link>
        </button>
      </main>

      {/* Features Section */}
      <section className="container px-4 mx-auto mt-16 sm:mt-24">
        <h3 className="mb-8 text-2xl font-bold text-center sm:text-3xl sm:mb-12">Key Features</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
          <FeatureCard 
            icon={<FaUserCheck />}
            title="Easy Check-In"
            description="Quick and simple attendance marking process for Students."
          />
          <FeatureCard 
            icon={<FaChartBar />}
            title="Insightful Analytics"
            description="Comprehensive reports and analytics to track attendance patterns."
          />
          <FeatureCard 
            icon={<FaClock />}
            title="Time Tracking"
            description="Real-time attendance insights for effective productivity control."
          />
          <FeatureCard 
            icon={<FaMobileAlt />}
            title="Mobile Friendly"
            description="Access the system on-the-go with our mobile-responsive design."
          />
        </div>
      </section>
      {/* Footer */}
      <footer className="py-6 mt-16 bg-purple-800 sm:mt-24 sm:py-8">
        <div className="container px-4 mx-auto text-sm text-center sm:text-base">
          <p>&copy; 2024 AttendEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="p-4 text-center bg-purple-700 rounded-lg sm:p-6">
      <div className="mb-3 text-3xl sm:text-4xl sm:mb-4">{icon}</div>
      <h4 className="mb-2 text-lg font-semibold sm:text-xl">{title}</h4>
      <p className="text-sm sm:text-base">{description}</p>
    </div>
  );
};

export default LandingPage;