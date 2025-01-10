import React, { useState, useContext } from "react";
import axios from "axios";
import { message } from "antd";
import CourseList from './CourseList';
import StudentStats from './StudentStats';
import { useOutletContext, useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [cloudinaryUrl, setCloudinaryUrl] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                message.error('Image size should not exceed 5MB');
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                message.error('Please upload an image file');
                return;
            }

            setImage(file);
            setResults(null);
            setError(null);
            message.success('Image selected successfully');
        }
    };

    const handleUpload = async () => {
        if (!image) {
            message.warning('Please select an image first!');
            return;
        }
    
        setLoading(true);
        setError(null);
    
        const messageKey = 'uploadMessage';
        message.loading({ content: 'Processing image...', key: messageKey });
    
        try {
            const formData = new FormData();
            formData.append('file', image);
    
            const response = await axios.post(
                'http://localhost:8000/upload_and_recognize/',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json',
                    },
                    timeout: 30000
                }
            );
    
            if (response.data) {
                setResults({
                    faces_detected: response.data.faces_detected || 0,
                    results: response.data.results || []
                });
                
                if (response.data.cloudinary_url) {
                    setCloudinaryUrl(response.data.cloudinary_url);
                }

                message.success({
                    content: `Successfully processed! Found ${response.data.faces_detected || 0} faces.`,
                    key: messageKey,
                    duration: 3
                });
            } else {
                throw new Error('Invalid response format from server');
            }
    
        } catch (err) {
            let errorMessage = "Error processing image";
            
            if (err.code === 'ECONNABORTED') {
                errorMessage = 'Request timed out. Please try again.';
            } else if (err.response) {
                switch (err.response.status) {
                    case 400:
                        errorMessage = err.response.data?.detail || 'Invalid image format';
                        break;
                    case 401:
                        errorMessage = 'Session expired. Please login again';
                        navigate('/login');
                        break;
                    case 413:
                        errorMessage = 'Image file is too large';
                        break;
                    case 500:
                        errorMessage = 'Server error. Please try again later';
                        break;
                    default:
                        errorMessage = err.response.data?.detail || 'Error uploading image';
                }
            }
    
            setError(errorMessage);
            message.error({
                content: errorMessage,
                key: messageKey,
                duration: 4
            });
            console.error('Upload error:', err);
        } finally {
            setLoading(false);
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
                                disabled={loading}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                        {image && (
                            <div className="mb-4">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Preview"
                                    className="object-cover w-full h-48 rounded-lg"
                                />
                            </div>
                        )}
                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className={`w-full px-4 py-2 text-white transition duration-300 ease-in-out transform rounded-lg ${
                                loading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
                            }`}
                        >
                            {loading ? 'Processing...' : 'Upload Image'}
                        </button>

                        {error && (
                            <div className="p-4 mt-4 text-red-500 rounded-lg bg-red-50">
                                {error}
                            </div>
                        )}

                        {results && results.results && (
                            <div className="p-4 mt-4 bg-white rounded-lg">
                                <h4 className="mb-2 font-semibold">Recognition Results:</h4>
                                <p>Faces Detected: {results.faces_detected}</p>
                                {results.results.map((face, index) => (
                                    <div key={index} className="p-2 mt-2 rounded bg-gray-50">
                                        <p>Name: {face.name}</p>
                                        <p>Confidence: {(face.confidence * 100).toFixed(2)}%</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            
                <div className="flex flex-col items-center justify-center mb-1 text-xl font-semibold rounded-lg shadow-md bg-stone-300 h-[15rem]">
                    <h3 className="mb-3 text-3xl">Quick Actions</h3>
                    <div className="grid grid-cols-1 gap-4 text-sm">
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