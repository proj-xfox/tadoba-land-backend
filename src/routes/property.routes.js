// src/routes/property.routes.js

import express from "express";
import {
    createProperty,
    getAllProperties,
    getPropertyById
} from "../controllers/property.controller.js";

// (optional - add later when auth ready)
// import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all properties (public)
router.get("/", getAllProperties);

// GET single property (public)
router.get("/:id", getPropertyById);

// CREATE property (protected - enable auth later)
router.post(
    "/",
    // authMiddleware, // 🔐 enable when auth is integrated
    createProperty
);

export default router;