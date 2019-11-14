const ErrorRes = require('../utils/errorRes');
const colors = require('colors');

const errorHandler = (err, req, res, next) => {
    console.log(err.stack.red);

    let error = { ...err };

    error.message = err.message;

    if (err.name === 'CastError') {
        error = new ErrorRes('Resource not found', 404);
    };

    if (err.name == 'ValidationError') {
        error = new ErrorRes('Validation Error', 400);
    };
    
    res.status(error.statusCode || 500).json({ success: false, error: error.message });
}

module.exports = errorHandler;