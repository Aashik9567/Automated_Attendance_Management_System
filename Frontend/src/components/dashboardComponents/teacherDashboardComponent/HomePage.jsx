import React,{useState} from "react";
import CourseList from './CourseList';
import StudentStats from './StudentStats';
import { useOutletContext } from "react-router-dom";
const HomePage = () => {
    const { changeTab } = useOutletContext();
    const [image, setImage] = useState(null);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImage(URL.createObjectURL(file));
      };
    
      const handleUpload = () => {
        if (image) {
          console.log("Uploading image:", image);
          // Here you would typically send the image to your server
          alert("Image uploaded successfully!");
          setImage(null);
        } else {
          alert("Please select an image first!");
        }
      };
  return (
    <>
      <div className="grid grid-cols-1 gap-1 mb-2 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg shadow-md bg-stone-300">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600">
            <h3 className="mb-2 text-xl font-semibold text-white">
              Upload Attendance Image
            </h3>
            <p className="text-sm text-blue-100">
              Upload an image to mark attendance
            </p>
          </div>
          <div className="p-4">
            <div className="mb-2">
              <label
                htmlFor="image-upload"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Select an image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {image && (
              <div className="mb-4">
                <img
                  src={image}
                  alt="Preview"
                  className="object-cover w-full h-48 rounded-lg"
                />
              </div>
            )}
            <button
              onClick={handleUpload}
              className="w-full px-4 py-2 text-white transition duration-300 ease-in-out transform bg-blue-500 rounded-lg hover:bg-blue-600 hover:scale-105"
            >
              Upload Image
            </button>
          </div>
          
        </div>
        <div className="flex flex-col items-center justify-center mb-1 text-xl font-semibold rounded-lg shadow-md bg-stone-300 h-[15rem]">
          <h3 className="mb-3 text-3xl">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 text-sm ">
            <button
              onClick={() => changeTab('Attendance', '/teacherdashboard/attendance')}
              className="p-2 text-white transition transform bg-blue-500 rounded hover:bg-blue-600 hover:scale-105"
            >
              Take Attendance
            </button>
            <button className="p-2 text-white transition transform bg-green-500 rounded hover:bg-green-600 hover:scale-105">
              Create Assignment
            </button>
          </div>
        </div>
       
      </div>
      <div className="grid grid-cols-1 gap-1 shadow-lg md:grid-cols-2">
        
      <CourseList />
        <div className="overflow-hidden rounded-lg shadow-md bg-stone-300">
          <div className="p-4 bg-gradient-to-r from-green-500 to-green-600">
            <h3 className="mb-2 text-xl font-semibold text-white">
              Student Statistics
            </h3>
            <p className="text-sm text-green-100">
              Overview of student performance
            </p>
          </div>
          <div className="p-4">
            <StudentStats />
          </div>
        </div>
        
      </div>
    </>
  );
};

export default HomePage;
