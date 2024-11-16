import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in-down">AttendEase</h1>
          <p className="text-xl mb-8 animate-fade-in-up">ML Driven Real-Time Face Detection And Web Integration</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* About Section */}
        <section className="flex flex-wrap justify-between items-center mb-20">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0 pr-0 lg:pr-12">
            <h2 className="text-4xl font-bold text-indigo-800 mb-6">About Our Project</h2>
            <p className="text-lg mb-6 text-gray-700 leading-relaxed">
              AttendEase is an innovative Automated Attendance System developed by students at the Advanced College of Engineering and Management, Tribhuvan University. Our system utilizes cutting-edge Machine Learning algorithms for real-time face detection and seamlessly integrates with a web-based platform for efficient and secure attendance management.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our mission is to revolutionize attendance tracking in educational institutions, saving time and resources while improving accuracy and accessibility of attendance records.
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Team working on project" 
              className="rounded-lg shadow-xl w-full object-cover h-96"
            />
          </div>
        </section>

        {/* Features Section */}
        <section>
          <h2 className="text-3xl font-bold text-indigo-800 mb-10 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "ML-Driven Face Detection",
                description: "Utilizes YOLO (You Only Look Once) algorithm for accurate and real-time face detection.",
                icon: "🤖"
              },
              {
                title: "Web Integration",
                description: "Seamless integration with a React-based web platform for easy access and management.",
                icon: "🌐"
              },
              {
                title: "Real-time Updates",
                description: "Instantly update attendance records across devices for immediate access to data.",
                icon: "⚡"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-indigo-800 mb-4">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-indigo-800 mb-10 text-center">Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              "Aashik Kumar Mahato",
              "Bhawana Adhikari",
              "Mandeep Kumar Mishra",
              "Rensa Neupane"
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div><img className="w-32 h-32 bg-emerald-300 rounded-full mx-auto mb-4"/></div>
                <p className="font-semibold text-indigo-800">{member}</p>
                <p className="text-sm text-gray-600">Team Member</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-700 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 AttendEase. All rights reserved.</p>
          <p className="mt-2">Tribhuvan University, Institute of Engineering</p>
          <p>Advanced College of Engineering and Management</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;