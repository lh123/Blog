function sendSuccess(res, data) {
    res.json({
        code: 0,
        msg: "success",
        data
    });
}

function sendError(res, errOrCode, msg) {
    if (msg === undefined) {
        res.json({
            code: errOrCode.code || 500,
            msg: errOrCode.message
        });
    } else {
        res.json({
            errOrCode,
            msg
        });
    }
}

function ApiError(code, msg) {
    let error = new Error(msg);
    error.code = code;
    return error;
}

module.exports = {
    sendSuccess,
    sendError,
    ApiError
}