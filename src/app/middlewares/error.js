const statusCodes = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    BUSINESS_ERROR: 422,
    DEFAULT_ERROR: 500
};

exports.handle = (error, req, res, next) => {
    res.status(statusCodes[error.errorCode] || statusCodes["DEFAULT_ERROR"])
    console.log(error.stack);
    return res.send({
        message: error.message,
        internal_code: error.errorCode
    });
};