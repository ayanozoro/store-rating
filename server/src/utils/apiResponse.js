export const sendSuccess = (res, status = 200, data = null, message = "Success") => {
    if (typeof status !== "number") {
        message = data || "Success";
        data = status;
        status = 200;
    }
    return res.status(status).json({
        success: true,
        message,
        data
    });
};

export const sendError = (res, status = 400, data = null, message = "Error") => {
    if (typeof status === "string") {
        message = status;
        status = typeof data === "number" ? data : 400;
        data = null;
    }
    return res.status(status).json({
        success: false,
        message,
        data
    });
};

export const sendPagination = (res, status = 200, data = null, pagination = {}, message = "Success") => {
    return res.status(status).json({
        success: true,
        message,
        data,
        pagination
    });
};