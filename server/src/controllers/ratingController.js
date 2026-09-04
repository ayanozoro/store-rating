import prisma from "../config/database.js";
import { sendSuccess, sendError, sendPagination } from "../utils/apiResponse.js";

export const submitRating = async (req, res) => {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    try {
        const store = await prisma.store.findUnique({
            where: { id: storeId }
        });

        if (!store) {
            return sendError(res, 404, null, "Store not found");
        }

        if (store.ownerId && store.ownerId === userId) {
            return sendError(res, 403, null, "You cannot rate your own store");
        }

        const existingRating = await prisma.rating.upsert({
            where: {
                userId_storeId: {
                    userId,
                    storeId
                }
            },
            update: {
                rating
            },
            create: {
                userId,
                storeId,
                rating
            }
        });

        return sendSuccess(res, 200, { rating: existingRating }, "Rating submitted successfully");
    } catch (error) {
        console.error("Rating submission error:", error);
        return sendError(res, 500, null, "Internal server error");
    }
};

export const getMyRatings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { sortBy = "createdAt", order = "desc", page = 1, limit = 10 } = req.query;

        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, parseInt(limit) || 10);
        const skip = (pageNum - 1) * limitNum;

        const where = { userId };

        const [ratings, total] = await Promise.all([
            prisma.rating.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: {
                    [sortBy]: order.toLowerCase() === "asc" ? "asc" : "desc"
                },
                include: {
                    store: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            address: true
                        }
                    }
                }
            }),
            prisma.rating.count({ where })
        ]);

        return sendPagination(res, 200, ratings, { page: pageNum, limit: limitNum, total }, "Ratings retrieved successfully");
    } catch (error) {
        console.error("Get ratings error:", error);
        return sendError(res, 500, null, "Internal server error");
    }
};

export const deleteMyRating = async (req, res) => {
    const { storeId } = req.params;
    const userId = req.user.id;

    try {
        const rating = await prisma.rating.findUnique({
            where: {
                userId_storeId: {
                    userId,
                    storeId
                }
            }
        });

        if (!rating) {
            return sendError(res, 404, null, "Rating not found for this store");
        }

        await prisma.rating.delete({
            where: {
                userId_storeId: {
                    userId,
                    storeId
                }
            }
        });

        return sendSuccess(res, 200, null, "Rating deleted successfully");
    } catch (error) {
        console.error("Delete rating error:", error);
        return sendError(res, 500, null, "Internal server error");
    }
};