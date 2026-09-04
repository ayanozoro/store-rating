import { sendError } from "../utils/apiResponse.js";

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return sendError(res, 401, null, "Unauthorized: Authentication required");
        }
        if (!allowedRoles.includes(req.user.role)) {
            return sendError(res, 403, null, "Forbidden: Access denied for your role");
        }
        next();
    };
};

export { authorize };