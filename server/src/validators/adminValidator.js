import { body } from "express-validator";
import { validate } from "./authValidator.js";

const createAdminUserValidator = [
    body("name")
        .trim()
        .isLength({ min: 20, max: 60 }).withMessage("Name must be between 20 and 60 characters"),
    body("email")
        .trim()
        .isEmail().withMessage("Invalid email address")
        .normalizeEmail(),
    body("password")
        .matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/)
        .withMessage("Password must be 8-16 characters, with at least one uppercase letter and one special character"),
    body("address")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 400 }).withMessage("Address cannot exceed 400 characters"),
    body("role")
        .trim()
        .notEmpty().withMessage("Role is required")
        .isIn(["SYSTEM_ADMIN", "STORE_OWNER", "NORMAL_USER"])
        .withMessage("Role must be one of: SYSTEM_ADMIN, STORE_OWNER, NORMAL_USER"),
    validate
];

export { createAdminUserValidator };
