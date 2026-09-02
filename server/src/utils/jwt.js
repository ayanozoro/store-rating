import jwt from 'jsonwebtoken';


const jwt_secret = process.env.JWT_SECRET;
const jwt_expires_in = process.env.JWT_EXPIRES_IN;

const generateToken = (payload) => {
    const { userId, role } = payload;

    try {
        const token = jwt.sign(
            { userId, role },
            jwt_secret,
            {
                expiresIn: jwt_expires_in
            }
        )

        return token;
    } catch (error) {
        console.log(`Error in jwt`)
    }
}

const verifyToken = (token) => {
    try {
        const decodedToken = jwt.verify(token, jwt_secret);
        return decodedToken;
    } catch (error) {
        console.log(`Error in jwt`)
    }
}

export { generateToken, verifyToken }