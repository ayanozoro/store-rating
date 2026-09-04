import prisma from "../config/database.js";
import { sendSuccess, sendError, sendPagination } from "../utils/apiResponse.js";

export const getAllStores = async (req, res) => {
    try {
        const { search, sortBy = "createdAt", order = "desc", page = 1, limit = 10 } = req.query;

        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, parseInt(limit) || 10);
        const skip = (pageNum - 1) * limitNum;

        // Search filter matching name or address
        const where = search ? {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { address: { contains: search, mode: "insensitive" } }
            ]
        } : {};

        // Run store fetch and count in parallel
        const [stores, total] = await Promise.all([
            prisma.store.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { [sortBy]: order.toLowerCase() === "asc" ? "asc" : "desc" },
                include: {
                    owner: {
                        select: { id: true, name: true, email: true }
                    },
                    ratings: {
                        select: { rating: true, userId: true }
                    }
                }
            }),
            prisma.store.count({ where })
        ]);

        const currentUserId = req.user?.id;

        // Transform stores to calculate averageRating, totalRatings, and myRating
        const formattedStores = stores.map((store) => {
            const count = store.ratings.length;
            const avg = count > 0
                ? Number((store.ratings.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1))
                : 0;

            const myRating = currentUserId
                ? store.ratings.find((r) => r.userId === currentUserId)?.rating || null
                : null;

            const { ratings, ...storeData } = store;

            return {
                ...storeData,
                averageRating: avg,
                totalRatings: count,
                myRating
            };
        });

        return sendPagination(
            res,
            200,
            formattedStores,
            { page: pageNum, limit: limitNum, total },
            "Stores retrieved successfully"
        );
    } catch (error) {
        console.error("Get all stores error:", error);
        return sendError(res, 500, null, "Internal server error");
    }
};


export const getStoreId = async (req, res) => {
    const { id } = req.params;
    const store = await prisma.store.findUnique({
        where: {
            id: id,
        },
        include: {
            owner: {
                select: {
                    id: true, name: true, email: true
                }
            },
            ratings: {
                select: {
                    rating: true, userId: true
                }
            }
        }
    })

    if (!store) {
        return sendError(res, 404, null, "Store not found");
    }

    const totalRating = store.ratings.length;
    const avgRating = totalRating > 0 ? Number((store.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRating).toFixed(1)) : 0;
    const myRating = req.user?.id ? store.ratings.find((r) => r.userId === req.user.id)?.rating || null : null;

    const { ratings, ...storeData } = store;
    return sendSuccess(res, 200, { ...storeData, averageRating: avgRating, totalRatings: totalRating, myRating }, "Store details retrieved successfully");

}

export const createStore = async (req, res) => {
    try {
        const { name, email, address, ownerId } = req.body;

        if (ownerId) {
            const owner = await prisma.user.findUnique({
                where: { id: ownerId }
            });
            if (!owner) {
                return sendError(res, 404, null, "Owner not found");
            }
            if (owner.role !== "STORE_OWNER") {
                return sendError(res, 400, null, "Assigned user must have STORE_OWNER role");
            }
            const existingStore = await prisma.store.findUnique({
                where: { ownerId }
            });
            if (existingStore) {
                return sendError(res, 400, null, "This owner is already assigned to another store");
            }
        }

        const store = await prisma.store.create({
            data: {
                name,
                email,
                address,
                ownerId: ownerId || null,
            },
            include: {
                owner: {
                    select: {
                        id: true, name: true, email: true
                    }
                },
                ratings: {
                    select: {
                        rating: true, userId: true
                    }
                }
            }
        });
        return sendSuccess(res, 201, { store }, "Store created successfully");
    } catch (error) {
        console.error("Create store error:", error);
        return sendError(res, 500, null, "Internal server error");
    }
};

export const updateStore = async (req, res) => {
    const { id } = req.params;
    const { name, email, address, ownerId } = req.body;
    try {
        const store = await prisma.store.findUnique({
            where: { id }
        });
        if (!store) {
            return sendError(res, 404, null, "Store not found");
        }

        if (ownerId && ownerId !== store.ownerId) {
            const owner = await prisma.user.findUnique({ where: { id: ownerId } });
            if (!owner || owner.role !== "STORE_OWNER") {
                return sendError(res, 400, null, "Assigned user must be a valid STORE_OWNER");
            }
            const existingStore = await prisma.store.findUnique({ where: { ownerId } });
            if (existingStore) {
                return sendError(res, 400, null, "This owner is already assigned to another store");
            }
        }

        const updatedStore = await prisma.store.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email }),
                ...(address !== undefined && { address }),
                ...(ownerId !== undefined && { ownerId: ownerId || null }),
            },
            include: {
                owner: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
        return sendSuccess(res, 200, { store: updatedStore }, "Store updated successfully");
    } catch (error) {
        console.error("Update store error:", error);
        return sendError(res, 500, null, "Internal server error");
    }
};

export const deleteStore = async (req, res) => {
    const { id } = req.params;
    try {
        const store = await prisma.store.findUnique({
            where: { id }
        });
        if (!store) {
            return sendError(res, 404, null, "Store not found");
        }
        await prisma.store.delete({
            where: { id }
        });
        return sendSuccess(res, 200, null, "Store deleted successfully");
    } catch (error) {
        console.error("Delete store error:", error);
        return sendError(res, 500, null, "Internal server error");
    }
};

