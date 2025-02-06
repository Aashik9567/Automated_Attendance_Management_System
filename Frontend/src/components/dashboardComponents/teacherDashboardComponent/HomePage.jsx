import React, { useState, useEffect, useRef } from "react";
import { X, Camera, Upload, Users, BookOpen, AlertCircle, RotateCw, CloudUpload,Plus } from 'lucide-react';
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { ReactTyped } from 'react-typed';
import { motion, AnimatePresence } from 'framer-motion';
import store from '../../../zustand/loginStore';

import StudentStats from './StudentStats';
import useAttendanceStore from "../../../zustand/attendanceStore.js";
const CameraCapture = ({ onCapture, onClose }) => {
    const fileInputRef = useRef(null);
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        onCapture(file);
      } else {
        message.error("Please capture an image file.");
      }
    };
  
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="relative w-full h-[80vh] max-w-2xl flex items-center justify-center">
          <button
            onClick={() => fileInputRef.current.click()}
            className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed bg-gray-800/50 rounded-xl border-white/20 hover:border-white/40"
          >
            <Camera className="w-12 h-12 mb-4 text-white" />
            <span className="text-lg text-white">Tap to capture image</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={onClose}
            className="absolute p-2 rounded-full top-4 right-4 bg-white/20 hover:bg-white/40"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    );
  };
const SubjectSetup = ({ onSubjectCreated }) => {
    const [subjectData, setSubjectData] = useState({
        name: '',
        code: '',
        semester: '',
        creditHours: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSubjectData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${loginUserData.baseURL}/subjects`,
                subjectData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            message.success('Subject created successfully!');
            onSubjectCreated(response.data);
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to create subject');
        }
    };

    return (
        <div className="max-w-md p-8 mx-auto bg-blue-200 shadow-xl rounded-2xl">
            <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                Setup Your Subject
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Subject Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={subjectData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Mathematics"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Subject Code
                    </label>
                    <input
                        type="text"
                        name="code"
                        value={subjectData.code}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. MATH101"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Semester
                    </label>
                    <input
                        type="text"
                        name="semester"
                        value={subjectData.semester}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Fall 2024"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Credit Hours
                    </label>
                    <input
                        type="number"
                        name="creditHours"
                        value={subjectData.creditHours}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 3"
                        min="1"
                        max="6"
                    />
                </div>
                <button
                    type="submit"
                    className="flex items-center justify-center w-full gap-2 px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-5 h-5" />
                    Create Subject
                </button>
            </form>
        </div>
    );
};
const HomePage = () => {
    const {loginUserData }= store(state => state);
    const { addAttendanceRecord } = useAttendanceStore();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [cloudinaryUrl, setCloudinaryUrl] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');

                const response = await axios.get(`${loginUserData.baseURL}/subjects`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                // Ensure we're setting an array
                const fetchedSubjects = response.data.data || [];
                setSubjects(fetchedSubjects);
                setError(null);
            } catch (error) {
                setSubjects([]);
                setError(error.response?.data?.message || 'Failed to fetch subjects');

                // Optional: Redirect to login if unauthorized
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, [navigate]);
    const handleCameraCapture = (capturedFile) => {
        handleFile(capturedFile);
        setShowCamera(false);
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    const handleFile = (file) => {
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

            const previewUrl = URL.createObjectURL(file);
            setImagePreviewUrl(previewUrl);
            message.success('Image selected successfully');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleImageLoad = () => {
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
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
                    addAttendanceRecord(
                        response.data.results,
                        subjects,
                        response.data.cloudinary_url
                    );
                }

                message.success({
                    content: `Successfully processed! Found ${response.data.faces_detected || 0} faces.`,
                    key: messageKey,
                    duration: 3
                });
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
        } finally {
            setLoading(false);
        }
        
    };
    const handleSubjectCreated = (newSubject) => {
        setSubjects(prevSubjects => [...prevSubjects, newSubject]);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }
    if (subjects.length === 0) {
        return <SubjectSetup onSubjectCreated={handleSubjectCreated} />;
    }
    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
            <AnimatePresence>
                {showCamera && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <CameraCapture
                            onCapture={handleCameraCapture}
                            onClose={() => setShowCamera(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="grid grid-cols-1 gap-8 mx-auto max-w-7xl lg:grid-cols-2">
                {/* Upload Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative overflow-hidden border shadow-2xl bg-white/5 backdrop-blur-xl rounded-3xl border-white/10"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />

                    <div className="relative p-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text">
                                <ReactTyped
                                    strings={["Intelligent Attendance Capture"]}
                                    typeSpeed={40}
                                    showCursor={false}
                                />
                            </h2>
                            <p className="mt-2 text-blue-200">AI-powered face recognition system</p>
                        </div>
                        {/* Image Preview Section */}
                        
                        {imagePreviewUrl && !loading && (
                         <motion.div 
                         initial={{ opacity: 0, y: -20 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="mb-6 overflow-hidden border border-white/10 rounded-xl"
                       >
                         <div className="relative aspect-video">
                           <img 
                             src={imagePreviewUrl} 
                             alt="Preview" 
                             className="absolute inset-0 object-contain w-full h-full"
                             onLoad={handleImageLoad}
                           />
                           <button
                             onClick={() => {
                               setImagePreviewUrl(null);
                               setImage(null);
                               setResults(null);
                             }}
                             className="absolute p-2 transition-all rounded-full bg-black/50 top-2 right-2 hover:bg-black/70"
                           >
                             <X className="w-4 h-4 text-white" />
                           </button>
                         </div>
                       </motion.div>
                        )}

                        {/* Upload Area */}
                        {!imagePreviewUrl && (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`relative group rounded-2xl border-2 border-dashed ${isDragging ? 'border-emerald-400' : 'border-white/20'
                                } transition-all duration-300 min-h-[200px]`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={loading}
                                className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
                                <CloudUpload className="w-8 h-8 text-purple-400 transition-colors group-hover:text-emerald-400" />
                                {!imagePreviewUrl && (
                                    <ReactTyped
                                        strings={[
                                            "Drag & Drop Attendance Photo",
                                            "Supported Formats: JPG/PNG/HEIC",
                                            "Max File Size: 5MB"
                                        ]}
                                        typeSpeed={50}
                                        backSpeed={30}
                                        loop
                                        className="text-lg text-center text-blue-200"
                                    />
                                )}
                            </div>
                        </motion.div>
                        )}

                        {/* Action Buttons */}
                        <div className="grid gap-4 mt-8 sm:grid-cols-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center gap-3 p-4 transition-all bg-white/5 rounded-xl hover:bg-white/10"
                                onClick={() => setShowCamera(true)}
                            >
                                <Camera className="w-6 h-6 text-purple-400" />
                                <span className="text-transparent bg-gradient-to-r from-blue-300 to-purple-200 bg-clip-text">
                                    Live Capture
                                </span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center gap-3 p-4 transition-all bg-gradient-to-r from-blue-600 to-purple-500 rounded-xl hover:shadow-blue-glow disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleUpload}
                                disabled={loading || !image}
                            >
                                {loading ? (
                                    <RotateCw className="w-6 h-6 text-white animate-spin" />
                                ) : (
                                    <>
                                        <Upload className="w-6 h-6 text-white" />
                                        <span className="font-medium text-white">
                                            Process Attendance
                                        </span>
                                    </>
                                )}
                            </motion.button>
                        </div>

                        {/* Results Section */}
                        {results && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 space-y-6"
                            >
                                <div className="p-6 bg-white/5 rounded-xl backdrop-blur-lg">
                                    <h3 className="mb-4 text-xl font-semibold text-blue-200">
                                        Recognition Analytics
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
                                            <span className="text-blue-300">Total Detections</span>
                                            <span className="text-2xl font-bold text-emerald-400">
                                                {results.faces_detected}
                                            </span>
                                        </div>

                                        {results.results.map((face, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="p-4 transition-colors rounded-lg bg-black/20 group hover:bg-white/5"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-blue-200">{face.name}</h4>
                                                        <p className="text-sm text-blue-300/80">
                                                            Confidence: {(face.confidence * 100).toFixed(1)}%
                                                        </p>
                                                    </div>
                                                    <div className="w-24 h-2 overflow-hidden rounded-full bg-white/10">
                                                        <div
                                                            className="h-full transition-all duration-500 bg-gradient-to-r from-blue-400 to-purple-400"
                                                            style={{ width: `${face.confidence * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Quick Actions Section */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-8 border shadow-2xl bg-white/5 backdrop-blur-xl rounded-3xl border-white/10"
                    >
                        <h3 className="mb-8 text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text">
                            Academic Dashboard
                        </h3>

                        <div className="space-y-6">
                            <motion.button
                                whileHover={{ y: -2 }}
                                className="w-full p-6 transition-all bg-white/5 rounded-xl hover:bg-white/10 group"
                                onClick={() => navigate('/teacherdashboard/attendance')}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-500">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-lg font-semibold text-blue-200">Live Attendance</h4>
                                        <p className="text-sm text-blue-300/80">Real-time tracking system</p>
                                    </div>
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ y: -2 }}
                                className="w-full p-6 transition-all bg-white/5 rounded-xl hover:bg-white/10 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-500">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-lg font-semibold text-blue-200">Assignment Hub</h4>
                                        <p className="text-sm text-blue-300/80">Create & manage tasks</p>
                                    </div>
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Statistics Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-8 border shadow-2xl bg-white/5 backdrop-blur-xl rounded-3xl border-white/10"
                    >
                        <h3 className="mb-6 text-2xl font-bold text-transparent bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text">
                            Student Insights
                        </h3>

                        <StudentStats />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;