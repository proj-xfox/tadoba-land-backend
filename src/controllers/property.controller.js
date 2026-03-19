// src/controllers/property.controller.js

import { propertyService } from "../services/property.service.js";

// CREATE property
export const createProperty = async (req, res, next) => {
    try {
        const result = await propertyService.createProperty(
            req.body,
            req.user
        );

        res.json(result);
    } catch (err) {
        next(err);
    }
};

// GET all properties
export const getAllProperties = async (req, res, next) => {
    try {
        const result = await propertyService.getAllProperties(req.query);

        res.json(result);
    } catch (err) {
        next(err);
    }
};

// GET single property
export const getPropertyById = async (req, res, next) => {
    try {
        const result = await propertyService.getPropertyById(
            req.params.id
        );

        res.json(result);
    } catch (err) {
        next(err);
    }
};