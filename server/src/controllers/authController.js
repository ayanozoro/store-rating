import prisma from "../config/database.js"
import { hashPassword, comparePassword } from "../utils/bcrypt.js"
import { generateToken } from "../utils/jwt.js"
import { sendSuccess, sendError } from "../utils/responseHandler.js"


const register = async (req, res) => {
    const { name, email, password, adress } = req.body

    try {
        const isDuplicate = await prisma.user.findUnique({
            where: { email }
        })

        if (isDuplicate) {
            sendError(res, "User with this email already exist", 400)
            return
        }
        const hashPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashPassword,
                adress,
                role: "NORMAL_USER"
            }
        })
        sendSuccess(res, "User registered Successfully", 201)

        const token = generateToken(user.id, user.role)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        })
    } catch (error) {
        console.log(error)
        sendError(res, "Internal server error", 500)
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        sendError(res, "All fields are required", 400)
        return
    }

    try {
        const user = await prisma.findUnique({
            where: {
                email
            }
        })
        if (!user) {
            sendError(res, "Invalid email or password", 400)
            return
        }

        const isPasswordValid = await comparePassword(password, user.password)
        if (!isPasswordValid) {
            sendError(res, "Invalid email or password", 400)
            return
        }

        const token = generateToken(user.id, user.role)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        })
        sendSuccess(res, "User logged in successfully", 200)

    } catch (error) {
        console.log(error)
        sendError(res, "Internal server error", 500)
    }
}

const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId
            }
        })
        sendSuccess(res, "User data fetched successfully", 200)
    } catch (error) {
        console.log(error)
        sendError(res, "Internal server error", 500)
    }
}

const changePassword = as