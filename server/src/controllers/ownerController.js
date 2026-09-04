import prisma from "../config/database.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getOwnerDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const store = await prisma.store.findUnique({
            where: { ownerId },
            include: {
                ratings: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    },
                    orderBy: { updatedAt: "desc" }
                }
            }
        });

        if (!store) {
            return sendSuccess(res, 200, { store: null }, "No store assigned to this owner yet");
        }

        const count = store.ratings.length;
        const avg = count > 0
            ? Number((store.ratings.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1))
            : 0;

        const formattedRatings = store.ratings.map(r => ({
            ratingId: r.id,
            rating: r.rating,
            user: {
                id: r.user.id,
                name: r.user.name,
                email: r.user.email
            },
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        }));

        const storeResponse = {
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            averageRating: avg,
            totalRatings: count,
            ratings: formattedRatings
        };

        return sendSuccess(res, 200, { store: storeResponse }, "Store owner dashboard retrieved successfully");
    } catch (error) {
        console.error("Owner dashboard error:", error);
        return sendError(res, 500, null, "Internal server error");
    }
};
