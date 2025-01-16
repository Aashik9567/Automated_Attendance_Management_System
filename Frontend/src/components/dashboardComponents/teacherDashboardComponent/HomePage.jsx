import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import StudentStats from './StudentStats';
import { useNavigate } from "react-router-dom";
import { Upload, Camera, BookOpen, Users, AlertCircle } from "lucide-react";

const HomePage = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [cloudinaryUrl, setCloudinaryUrl] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

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
            console.error('Upload error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-blue-200 shadow-xl rounded-2xl">
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
                <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
                    <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800">
                        <div className="flex items-center gap-3">
                            <Camera className="w-8 h-8 text-white" />
                            <h3 className="text-2xl font-bold text-white">
                                Upload Attendance Image
                            </h3>
                        </div>
                    </div>
                    <div className="p-8">
                        <div
                            className={`relative mb-6 rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out ${isDragging
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-blue-400'
                                }`}
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
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <Upload className="w-12 h-12 mb-4 text-blue-500" />
                                <p className="mb-2 text-lg font-medium text-gray-700">
                                    Drag and drop your image here
                                </p>
                                <p className="text-sm text-gray-500">
                                    or click to browse (max 5MB)
                                </p>
                            </div>
                        </div>

                        {imagePreviewUrl && (
                            <div className="mb-8 overflow-hidden bg-gray-50 rounded-xl">
                                <div className="relative aspect-video">
                                    <img
                                        src={imagePreviewUrl}
                                        alt="Preview"
                                        className="absolute inset-0 object-contain w-full h-full"
                                        onLoad={handleImageLoad}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className={`w-full px-6 py-4 text-white text-lg font-semibold rounded-xl transition-all duration-300 transform ${loading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                {loading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        Upload Image
                                    </>
                                )}
                            </div>
                        </button>

                        {error && (
                            <div className="flex items-start gap-3 p-4 mt-6 text-red-700 rounded-xl bg-red-50">
                                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        {results && results.results && (
                            <div className="p-6 mt-6 rounded-xl bg-gray-50">
                                <h4 className="mb-4 text-xl font-semibold text-gray-800">
                                    Recognition Results
                                </h4>
                                <div className="p-4 mb-4 bg-white rounded-lg shadow-sm">
                                    <p className="text-lg text-gray-700">
                                        Faces Detected: <span className="font-semibold">{results.faces_detected}</span>
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    {results.results.map((face, index) => (
                                        <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
                                            <p className="mb-2 font-medium text-gray-800">
                                                Name: {face.name}
                                            </p>
                                            <div className="w-full h-2 mb-1 bg-gray-100 rounded-full">
                                                <div
                                                    className="h-2 bg-blue-500 rounded-full"
                                                    style={{ width: `${face.confidence * 100}%` }}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Confidence: {(face.confidence * 100).toFixed(2)}%
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="p-8 bg-white shadow-xl rounded-2xl">
                        <h3 className="mb-6 text-2xl font-bold text-gray-800">Quick Actions</h3>
                        <div className="grid gap-4">
                            <button
                                onClick={() => navigate('/teacherdashboard/attendance')}
                                className="flex items-center justify-center w-full gap-3 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:-translate-y-1 hover:shadow-lg"
                            >
                                <Users className="w-5 h-5" />
                                Take Attendance
                            </button>
                            <button
                                className="flex items-center justify-center w-full gap-3 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:-translate-y-1 hover:shadow-lg"
                            >
                                <BookOpen className="w-5 h-5" />
                                Create Assignment
                            </button>
                        </div>
                    </div>


                    <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
                        <div className="p-6 bg-gradient-to-r from-green-600 to-green-800">
                            <div className="flex items-center gap-3">
                                <Users className="w-8 h-8 text-white" />
                                <h3 className="text-2xl font-bold text-white">
                                    Student Statistics
                                </h3>
                            </div>
                            <p className="mt-2 text-green-100">
                                Overview of student performance
                            </p>
                        </div>
                        <div className="p-8">
                            <StudentStats />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;