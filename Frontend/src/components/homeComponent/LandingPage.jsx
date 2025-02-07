import React from 'react';
import { FaUserCheck, FaChartLine, FaDatabase, FaShieldAlt, FaRocket, FaFacebook, FaTimes } from 'react-icons/fa';
import logo from '../../assets/Logo.svg';
import { Link } from 'react-router-dom';
import { ReactTyped } from "react-typed";

const LandingPage = () => {
  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-md">
        <nav className="container flex flex-wrap items-center justify-between px-4 py-4 mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img className="w-10 h-10 sm:w-[60px] sm:h-[60px] rounded-full" src={logo} alt="logo" />
            <span className="text-xl font-bold text-transparent sm:text-2xl bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text">
              AttendEase
            </span>
          </div>
          <div className="flex items-center mt-2 space-x-2 sm:space-x-4 sm:mt-0">
            <Link
              to="/teacherdashboard"
              className="px-4 py-2 text-xs font-medium transition-all duration-300 rounded-full sm:text-base bg-white/10 hover:bg-white/20 hover:shadow-glow"
            >
              Educator Portal
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-medium text-purple-900 transition-all duration-300 bg-purple-300 rounded-lg sm:text-base hover:bg-purple-400 hover:shadow-glow"
            >
              Login
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container px-4 mx-auto mt-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            <span className="block mb-4 text-purple-300">Intelligent Attendance Tracking</span>
            <ReactTyped
              strings={["With YOLOv8 & FaceNet Technology"]}
              typeSpeed={50}
              className="text-transparent bg-gradient-to-r from-blue-300 to-purple-200 bg-clip-text"
            />
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-200 sm:text-xl">
            Revolutionizing academic attendance management through cutting-edge AI-powered facial recognition,
            ensuring 99.6% accuracy with real-time processing and secure cloud integration.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/aboutus" className="px-8 py-3 font-semibold text-white transition-all duration-300 bg-purple-500 rounded-full hover:bg-purple-600 hover:shadow-glow">
              Explore Features
            </Link>
            <Link to="/demo" className="px-8 py-3 font-semibold text-purple-100 transition-all duration-300 border-2 border-purple-300 rounded-full hover:bg-purple-900/50">
              Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-20 mx-auto">
        <h2 className="mb-16 text-3xl font-bold text-center sm:text-4xl">Core Technologies</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<FaUserCheck className="w-12 h-12" />}
            title="Real-Time Detection"
            description="YOLOv8-powered face detection with multi-angle recognition capabilities"
          />
          <FeatureCard
            icon={<FaDatabase className="w-12 h-12" />}
            title="Secure Storage"
            description="Military-grade encrypted attendance records with role-based access"
          />
          <FeatureCard
            icon={<FaChartLine className="w-12 h-12" />}
            title="Smart Analytics"
            description="AI-driven insights and attendance pattern visualization"
          />
          <FeatureCard
            icon={<FaShieldAlt className="w-12 h-12" />}
            title="Fraud Prevention"
            description="Advanced anti-spoofing measures and live face verification"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30">
        <div className="container px-4 py-12 mx-auto">
          <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">AttendEase</h3>
              <p className="text-gray-400">Redefining academic attendance management through AI innovation.</p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Technology</h4>
              <ul className="space-y-2 text-gray-400">
                <li>YOLOv8 Architecture</li>
                <li>FaceNet Embeddings</li>
                <li>MERN Stack</li>
                <li>Cloud Integration</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/documentation">Documentation</Link></li>
                <li><Link to="/research">White Paper</Link></li>
                <li><Link to="/case-studies">Case Studies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Contact</h4>
              <p className="text-gray-400">IOE Engineering Campus<br />Kathmandu, Nepal<br />aashik.077bei002@acem.edu.np</p>
            </div>
          </div>
          <div className="pt-8 mt-8 text-center border-t border-white/10">
            <p className="text-gray-400">&copy; 2024 AttendEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 transition-all duration-300 bg-white/5 rounded-xl hover:bg-white/10 hover:shadow-glow">
    <div className="mb-4 text-purple-400">{icon}</div>
    <h3 className="mb-2 text-xl font-semibold">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const StatCard = ({ icon, number, label }) => (
  <div className="p-6 bg-white/5 rounded-xl">
    <div className="mb-3 text-purple-400">{icon}</div>
    <div className="text-3xl font-bold text-purple-300">{number}</div>
    <div className="text-gray-300">{label}</div>
  </div>
);

export default LandingPage;