import prisma from "../config/database.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

const register = async (req, res) => {
    const { name, email, password, address, adress } = req.body;
    const userAddress = address || adress || null;

    try {
        const isDuplicate = await prisma.user.findUnique({
            where: { email }
        });

        if (isDuplicate) {
            return sendError(res, 400, null, "User with this email already exists");
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                address: userAddress,
                role: "NORMAL_USER"
            },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                createdAt: true
            }
        });

        const token = generateToken({ userId: user.id, role: user.role });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        return sendSuccess(res, 201, { user, token }, "User registered successfully");
    } catch (error) {
        console.error("Register error:", error);
        return sendError(res, 500, null, "Internal server error");
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return sendError(res, 400, null, "Email and password are required");
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return sendError(res, 401, null, "Invalid email or password");
        }

        const isPasswordValid = await comparePassword(password, user.passwordHash);
        if (!isPasswordValid) {
            return sendError(res, 401, null, "Invalid email or password");
        }

        const token = generateToken({ userId: user.id, role: user.role });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role,
            createdAt: user.createdAt
        };

        return sendSuccess(res, 200, { user: userResponse, token }, "User logged in successfully");
    } catch (error) {
        console.error("Login error:", error);
        return sendError(res, 500, null, "Internal server error");
    }
};

const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return sendError(res, 404, null, "User not found");
        }

        return sendSuccess(res, 200, { user }, "User data fetched successfully");
    } catch (error) {
        console.error("GetMe error:", error);
        return sendError(res, 500, null, "Internal server error");
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user) {
            return sendError(res, 404, null, "User not found");
        }

        const isPasswordValid = await comparePassword(oldPassword, user.passwordHash);
        if (!isPasswordValid) {
            return sendError(res, 400, null, "Incorrect current password");
        }

        const newHashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { passwordHash: newHashedPassword }
        });

        return sendSuccess(res, 200, null, "Password changed successfully");
    } catch (error) {
        console.error("ChangePassword error:", error);
        return sendError(res, 500, null, "Internal server error");
    }
};

const logout = async (req, res) => {
    res.clearCookie("token");
    return sendSuccess(res, 200, null, "User logged out successfully");
};

export { register, login, getMe, changePassword, logout };