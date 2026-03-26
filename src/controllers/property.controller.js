// src/controllers/property.controller.js

import { propertyService } from "../services/property.service.js";

// CREATE property
export const createProperty = async (req, res, next) => {
    try {
        const result = await propertyService.createProperty(
            req.body,
            req.user
        );

        res.status(201).json({
            success: true,
            data: result
        });

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

export const getFeaturedProperties = async (req, res, next) => {
    try {
        const properties = await propertyService.getFeaturedProperties();

        res.json({
            success: true,
            data: properties
        });

    } catch (err) {
        next(err);
    }
};

// ADD IMAGES TO PROPERTY
export const addPropertyImages = async (req, res, next) => {
    try {
        const { propertyId, images } = req.body;

        await propertyService.addPropertyImages(propertyId, images);

        res.json({
            success: true
        });

    } catch (err) {
        next(err);
    }
};

// ACTIVATE PROPERTY
export const activateProperty = async (req, res, next) => {
    try {
        const result = await propertyService.activateProperty(
            req.params.id
        );

        res.json({
            success: true,
            data: result
        });

    } catch (err) {
        next(err);
    }
};

export const getOwnerProperties = async (req, res, next) => {
    try {
        const properties = await propertyService.getOwnerProperties();

        res.json({
            success: true,
            data: properties
        });

    } catch (err) {
        next(err);
    }
};

export const getAgentProperties = async (req, res, next) => {
    try {
        const properties = await propertyService.getAgentProperties();

        res.json({
            success: true,
            data: properties
        });

    } catch (err) {
        next(err);
    }
};