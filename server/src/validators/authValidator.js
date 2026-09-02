import { body, validationResult } from "express-validator";
import { sendError } from "../utils/apiResponse.js";

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    const mapped = errors.array().map(e => e.msg);
    sendError(res, 400, mapped, "Validation Error");
}

const registerValidator = [
    body("name").trim().isLength({ min: 20, max: 60 }).withMessage("Name must be between 20 and 60 characters"),
    body("email").trim().isEmail().withMessage("Invalid email address").normalizeEmail(),
    body("password").matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/).withMessage("Password must be 8-16 characters, with at least one uppercase letter and one special character"),
    body("address").optional().trim().isLength({ max: 400 }).withMessage("Address cannot exceed 400 characters"),
    validate
]

const loginValidator = [
    body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
    validate
]

const changePasswordValidator = [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/).withMessage("New password must be 8-16 characters, with at least one uppercase letter and one special character"),
    validate
]

export {
    registerValidator,
    validate,
    loginValidator,
    changePasswordValidator
}