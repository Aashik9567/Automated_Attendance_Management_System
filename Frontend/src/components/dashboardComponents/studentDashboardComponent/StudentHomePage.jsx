import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactTyped } from 'react-typed';
import axios from 'axios';
import { 
    RocketFilled, 
    CheckCircleFilled, 
    CalendarFilled, 
    PieChartFilled, 
    FireFilled, 
    TrophyFilled, 
    ScheduleFilled 
} from '@ant-design/icons';
import { Users, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import store from '../../../zustand/loginStore';


const StudentHomePage = () => {
    const navigate = useNavigate();
    const { loginUserData } = store((state) => state);
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [stats, setStats] = useState({
        attendancePercentage: 0,
        totalClasses: 0,
        attendedClasses: 0,
    });
    const api = axios.create({
        baseURL: loginUserData.baseURL,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
    
    useEffect(() => {
        const fetchSubjectsAndStats = async () => {
            try {
                const { data: subjectsResponse } = await api.get('/subjects');
                
                if (!subjectsResponse.data || subjectsResponse.data.length === 0) {
                    console.warn('No subjects found for the student.');
                    setLoading(false);
                    return;
                }
                
                const firstSubjectId = subjectsResponse.data[0]._id;
                const { data: subjectDetailsResponse } = await api.get(`/subjects/${firstSubjectId}`);
                
                const subjectDetails = subjectDetailsResponse.data;
                
                setSubjects(subjectsResponse.data);
                setStats({
                    attendancePercentage: subjectDetails.attendancePercentage || 0,
                    totalClasses: subjectDetails.totalClasses || 0,
                    attendedClasses: subjectDetails.attendedClasses || 0,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSubjectsAndStats();
    }, [navigate]);

    const performanceStats = [
        {
            title: 'Attendance Percentage',
            value: `${stats.attendancePercentage}%`,
            icon: <CheckCircleFilled className="text-3xl text-white" />,
            progress: stats.attendancePercentage / 100,
            gradient: 'from-green-500 to-emerald-600',
        },
        {
            title: 'Total Classes',
            value: stats.totalClasses,
            icon: <CalendarFilled className="text-3xl text-white" />,
            trend: '📈 Consistent',
            gradient: 'from-blue-500 to-indigo-600',
        },
        {
            title: 'Attended Classes',
            value: stats.attendedClasses,
            icon: <PieChartFilled className="text-3xl text-white" />,
            trend: '🎯 On Track',
            gradient: 'from-purple-500 to-fuchsia-600',
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
                <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 rounded-xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
            <div className="grid grid-cols-1 gap-8 mx-auto max-w-7xl lg:grid-cols-2">
                {/* Main Performance Dashboard */}
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
                                    strings={["Your Academic Performance", "Attendance Dashboard"]}
                                    typeSpeed={40}
                                    showCursor={false}
                                />
                            </h2>
                            <p className="mt-2 text-blue-200">Comprehensive performance metrics</p>
                        </div>

                        {/* Performance Stats Grid */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            {performanceStats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 transition-all rounded-xl bg-white/5 hover:bg-white/10"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-500">
                                            {stat.icon}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-blue-300">{stat.title}</p>
                                            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                        </div>
                                    </div>
                                    {stat.trend && (
                                        <div className="px-2 py-1 text-xs text-center text-blue-200 rounded-full bg-white/10">
                                            {stat.trend}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions & Insights */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-8 border shadow-2xl bg-white/5 backdrop-blur-xl rounded-3xl border-white/10"
                    >
                        <h3 className="mb-8 text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text">
                            Quick Academic Actions
                        </h3>

                        <div className="space-y-6">
                            <motion.button
                                whileHover={{ y: -2 }}
                                className="w-full p-6 transition-all bg-white/5 rounded-xl hover:bg-white/10 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-500">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-lg font-semibold text-blue-200">Detailed Attendance</h4>
                                        <p className="text-sm text-blue-300/80">View detailed class records</p>
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
                                        <h4 className="text-lg font-semibold text-blue-200">Course Materials</h4>
                                        <p className="text-sm text-blue-300/80">Access learning resources</p>
                                    </div>
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Engagement Metrics */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-8 border shadow-2xl bg-white/5 backdrop-blur-xl rounded-3xl border-white/10"
                    >
                        <h3 className="mb-6 text-2xl font-bold text-transparent bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text">
                            Engagement Insights
                        </h3>

                        <div className="space-y-4">
                            <div className="p-4 transition-colors rounded-lg bg-black/20 group hover:bg-white/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-blue-200">Current Streak</h4>
                                        <p className="text-sm text-blue-300/80">
                                            <FireFilled className="mr-2 text-orange-500" />
                                            5 days
                                        </p>
                                    </div>
                                    <div className="w-24 h-2 overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className="h-full transition-all duration-500 bg-gradient-to-r from-orange-400 to-red-500"
                                            style={{ width: '60%' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 transition-colors rounded-lg bg-black/20 group hover:bg-white/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-blue-200">Best Streak</h4>
                                        <p className="text-sm text-blue-300/80">
                                            <TrophyFilled className="mr-2 text-yellow-500" />
                                            12 days
                                        </p>
                                    </div>
                                    <div className="w-24 h-2 overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className="h-full transition-all duration-500 bg-gradient-to-r from-yellow-400 to-amber-500"
                                            style={{ width: '90%' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Achievement Banner */}
            <motion.div
                className="relative p-8 mt-8 overflow-hidden text-white shadow-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-2xl"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
            >
                <div className="relative z-10 text-center">
                    <div className="mb-4 text-5xl">
                        {stats.attendancePercentage >= 75 ? "🏆" : "🚀"}
                    </div>
                    <h2 className="mb-2 text-3xl font-bold text-white">
                        {stats.attendancePercentage >= 75 
                            ? `Outstanding! You're leading with ${stats.attendancePercentage}% attendance`
                            : `Reach for ${Math.ceil(stats.attendancePercentage / 10) * 10 + 10}%! You're at ${stats.attendancePercentage}%`}
                    </h2>
                    <p className="text-lg text-blue-100">
                        {stats.attendancePercentage >= 75
                            ? "Maintain this momentum for academic excellence!"
                            : "Every class attended brings you closer to your goals!"}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default StudentHomePage;