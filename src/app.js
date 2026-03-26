import express from "express";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import agentRoutes from "./routes/agent.routes.js";

// (Future ready)
// import authRoutes from "./routes/auth.routes.js";
// import userRoutes from "./routes/user.routes.js";

// Middleware (future)
// import authMiddleware from "./middleware/authMiddleware.js";
// import errorHandler from "./middleware/errorHandler.js";

const app = express();

// ------------------------------------------
// GLOBAL MIDDLEWARE
// ------------------------------------------
app.use(cors());
app.use(express.json());

// ------------------------------------------
// HEALTH CHECK (Render friendly)
// ------------------------------------------
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "TadobaLand API is running 🚀",
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "TadobaLand Backend",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// ------------------------------------------
// PUBLIC ROUTES
// ------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/agents", agentRoutes);

// ------------------------------------------
// PROTECTED ROUTES (future)
// ------------------------------------------
// app.use(authMiddleware);
// app.use("/api/users", userRoutes);

// ------------------------------------------
// GLOBAL ERROR HANDLER (future)
// ------------------------------------------
// app.use(errorHandler);

export default app;