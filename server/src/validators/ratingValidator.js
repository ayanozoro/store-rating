import { body } from "express-validator";
import { validate } from "./authValidator.js";

const ratingValidator = [
    body("storeId")
        .trim()
        .notEmpty().withMessage("Store ID is required")
        .isUUID().withMessage("Store ID must be a valid UUID"),
    body("rating")
        .notEmpty().withMessage("Rating value is required")
        .isInt({ min: 1, max: 5 }).withMessage("Rating must be an integer between 1 and 5")
        .toInt(),
    validate
];

export { ratingValidator };
