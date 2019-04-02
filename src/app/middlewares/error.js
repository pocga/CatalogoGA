const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  BAD_REQUEST: 400,
  PRODUCT_NOT_FOUND: 404,
  MOCK_ERROR: 422,
  MONGO_ERROR: 422
};

exports.handle = (error, req, res, next) => {      
    res.status(statusCodes[error.errorCode] || DEFAULT_STATUS_CODE)
    //logger.error(error);
    console.log("Entre al handler");
    return res.send({
            message: error.message,
            internal_code: error.errorCode
        });
};
