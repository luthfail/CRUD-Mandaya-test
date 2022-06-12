const errorHandler = (err, req, res, next) => {
    switch(err.name) {
        case 'SequelizeUniqueConstraintError':
        case 'SequelizeValidationError':
            res.status(400).json({
                statusCode: 400,
                message: err.errors[0].message
            });
            break;
        case "INVALID":
            res.status(401).json({
                statusCode: 401,
                message: err.message
            });
        case "JsonWebTokenError":
            res.status(401).json({
                statusCode: 401,
                message: 'Invalid token'
            });
            break;
        case "FORBIDDEN":
            res.status(403).json({
                statusCode: 403,
                message: err.message
            });
            break;
        case 'NOT_FOUND':
            res.status(404).json({
                statusCode: 404,
                message: err.message
            });
            break;

        default:
            res.status(500).json({
                statusCode: 500,
                message: 'Internal Server Error'
            });
            break;
    }
}

module.exports = errorHandler;