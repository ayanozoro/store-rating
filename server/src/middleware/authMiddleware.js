import { verifyToken } from '../utils/jwt.js';
import prisma from '../config/database.js';
import { sendError } from '../utils/apiResponse.js';

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) return res.status(401).send("Unauthorized");

    try {
        const token = authHeader.split(" ")[1];
        const decodedToken = verifyToken(token);
        if (!decodedToken) return res.status(401).send("Unauthorized");
        const user = await prisma.user.findUnique({
            where: { id: decodedToken.userId },
            select: { id: true, name: true, email: true, role: true, address: true },
        });
        if (!user) return res.status(401).send("Unauthorized");
        req.user = user;
        next();
    }
    catch (error) {
        sendError(res, "Invalid Token or expire token", 401);
    }
}

export { authenticate }