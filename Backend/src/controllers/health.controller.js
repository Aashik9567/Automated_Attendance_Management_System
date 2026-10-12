// Uptime-monitor ping (e.g. UptimeRobot). Deliberately does no database or
// face-service work so frequent checks stay cheap; /api/v1/health has details.
export const healthCheck = (req, res) => {
    res.status(200).json({ success: true, message: "OK", timestamp: new Date().toISOString() });
};
