import prisma from "../config/database.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { hashPassword } from "../utils/password.js";


export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalStores = await prisma.store.count();
        const totalRatings = await prisma.rating.count();
        const userByRole = await prisma.user.groupBy({
            by: ['role'],
            _count: {
                id: true,
            },
        });
        const ratingsByCategory = await prisma.rating.groupBy({
            by: ['storeId'],
            _count: {
                id: true,
            },
        });

        const roleBreakdown = userByRole.reduce((acc, curr) => {
            acc[curr.role] = curr._count.id;
            return acc;
        }, {});

        const stats = {
            totalUsers,
            totalStores,
            totalRatings,
            roleBreakdown,
            userByRole,
            ratingsByCategory
        };

        return sendSuccess(res, 200, { stats, ...stats }, "Dashboard stats retrieved successfully");
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return sendError(res, 500, null, "Failed to retrieve dashboard stats");
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const { search, role, sortBy = "createdAt", order = "desc" } = req.query;

        const where = {};

        if (role && ["SYSTEM_ADMIN", "STORE_OWNER", "NORMAL_USER"].includes(role)) {
            where.role = role;
        }

        if (search && search.trim()) {
            const query = search.trim();
            where.OR = [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
                { address: { contains: query, mode: "insensitive" } }
            ];
        }

        const validSortFields = ["name", "email", "role", "address", "createdAt"];
        const orderField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
        const orderDirection = order.toLowerCase() === "asc" ? "asc" : "desc";

        const users = await prisma.user.findMany({
            where,
            orderBy: { [orderField]: orderDirection },
            include: {
                ownedStore: {
                    select: {
                        id: true,
                        name: true,
                        ratings: {
                            select: { rating: true }
                        }
                    }
                }
            }
        });

        const formattedUsers = users.map(user => {
            let storeRating = null;
            let storeName = null;
            if (user.role === "STORE_OWNER" && user.ownedStore) {
                storeName = user.ownedStore.name;
                const count = user.ownedStore.ratings.length;
                storeRating = count > 0
                    ? Number((user.ownedStore.ratings.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1))
                    : 0;
            }

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role,
                createdAt: user.createdAt,
                storeName,
                storeRating
            };
        });

        return sendSuccess(res, 200, { users: formattedUsers }, "Users retrieved successfully");
    } catch (error) {
        console.error("Error retrieving users:", error);
        return sendError(res, 500, null, "Failed to retrieve users");
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return sendError(res, 400, null, "User with this email already exists");
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                address: address ? address.trim() : null,
                role: role || "NORMAL_USER"
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                address: true,
                createdAt: true
            }
        });

        return sendSuccess(res, 201, { user }, "User created successfully");
    } catch (error) {
        console.error("Error creating user:", error);
        return sendError(res, 500, null, "Failed to create user");
    }
};