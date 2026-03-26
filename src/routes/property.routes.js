// src/routes/property.routes.js

import express from "express";
import {
    createProperty,
    getAllProperties,
    getPropertyById, getFeaturedProperties,
    addPropertyImages,
    activateProperty, getOwnerProperties, getAgentProperties
} from "../controllers/property.controller.js";

// (optional - add later when auth ready)
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/featured", getFeaturedProperties);

// ✅ ADD THESE BEFORE :id
router.get("/owner", getOwnerProperties);
router.get("/agent", getAgentProperties);

// GET all properties
router.get("/", getAllProperties);

// ❗ KEEP THIS LAST
router.get("/:id", getPropertyById);

// POST / PATCH
router.post("/", authMiddleware, createProperty);
router.post("/images", addPropertyImages);
router.patch("/:id/activate", activateProperty);

export default router;