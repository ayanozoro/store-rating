import { body } from "express-validator";
import { validate } from "./authValidator.js";

const createStoreValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Store name is required")
        .isLength({ max: 60 }).withMessage("Store name cannot exceed 60 characters"),
    body("email")
        .trim()
        .isEmail().withMessage("Valid store email is required")
        .normalizeEmail(),
    body("address")
        .trim()
        .notEmpty().withMessage("Store address is required")
        .isLength({ max: 400 }).withMessage("Address cannot exceed 400 characters"),
    body("ownerId")
        .optional({ nullable: true })
        .isUUID().withMessage("Owner ID must be a valid UUID"),
    validate
];

const updateStoreValidator = [
    body("name")
        .optional()
        .trim()
        .notEmpty().withMessage("Store name cannot be empty")
        .isLength({ max: 60 }).withMessage("Store name cannot exceed 60 characters"),
    body("email")
        .optional()
        .trim()
        .isEmail().withMessage("Valid store email is required")
        .normalizeEmail(),
    body("address")
        .optional()
        .trim()
        .notEmpty().withMessage("Store address cannot be empty")
        .isLength({ max: 400 }).withMessage("Address cannot exceed 400 characters"),
    body("ownerId")
        .optional({ nullable: true })
        .isUUID().withMessage("Owner ID must be a valid UUID"),
    validate
];

export {
    createStoreValidator,
    updateStoreValidator
};
