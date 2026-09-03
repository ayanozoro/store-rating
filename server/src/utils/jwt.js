import "dotenv/config";
import jwt from "jsonwebtoken";

const getSecret = () => process.env.JWT_SECRET || "store_rating_super_secret_jwt_key_2026_change_in_production";
const getExpiresIn = () => process.env.JWT_EXPIRES_IN || "1d";

const generateToken = (payload) => {
    const { userId, role } = payload;

    try {
        const token = jwt.sign(
            { userId, role },
            getSecret(),
            { expiresIn: getExpiresIn() }
        );
        return token;
    } catch (error) {
        console.error("Error generating JWT:", error.message);
        return null;
    }
};

const verifyToken = (token) => {
    try {
        const decodedToken = jwt.verify(token, getSecret());
        return decodedToken;
    } catch (error) {
        console.error("Error verifying JWT:", error.message);
        return null;
    }
};

export { generateToken, verifyToken };