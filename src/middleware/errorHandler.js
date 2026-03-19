export default function errorHandler(err, req, res, next) {
    if (process.env.NODE_ENV === "development") {
        console.error("🔥 Global Error:", err);
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Something went wrong",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
}
