const sendSuccess = (res, status = 200, data, message = "Success") => {
    res.status(status).json({
        success: true,
        message,
        data
    })
}

const sendError = (res, status = 400, data, message = "Error") => {
    res.status(status).json({
        success: false,
        message,
        data
    })
}

const sendPagination = (res, status = 200, data, message = "Success") => {
    const pagination = {
        page,
        limit,
        total
    }

    res.status(status).json({
        success: true,
        message,
        data,
        pagination
    })
}

module.exports = { sendSuccess, sendError, sendPagination }