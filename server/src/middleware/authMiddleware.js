import { verifyToken } from '../utils/jwt.js';
import prisma from '../config/database.js';
import { sendError } from '../utils/apiResponse.js';

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return sendError(res, 401, null, "Unauthorized: No token provided");
    }

    try {
        const token = authHeader.split(" ")[1];
        const decodedToken = verifyToken(token);
        if (!decodedToken || !decodedToken.userId) {
            return sendError(res, 401, null, "Unauthorized: Invalid token");
        }

        const user = await prisma.user.findUnique({
            where: { id: decodedToken.userId },
            select: { id: true, name: true, email: true, role: true, address: true },
        });

        if (!user) {
            return sendError(res, 401, null, "Unauthorized: User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        return sendError(res, 401, null, "Unauthorized: Invalid or expired token");
    }
};

export { authenticate };