const logHelper = require("../modules/helper/log.helper");
/**
 * Handles API success response.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {any} data - The data to be included in the response.
 * @param {string} message - The success message to be included in the response.
 * @param {number} status - The HTTP status code of the response.
 */
function handleApiSuccess(req, res, data, message, status) {
  // Log the API success using the apiLogger
  logHelper.create({
    req,
    response: {
      status: true,
      message,
      data,
    },
  });
  // Send the success response with the specified status code, message, and data
  res.status(status).json({
    status: true,
    message,
    data,
  });
}

function handleApiSuccessNoData(req, res, data, message, status) {
  // Log the API success using the apiLogger
  logHelper.create({
    req,
    response: {
      status: false,
      message,
      data,
    },
  });

  // Send the success response with the specified status code, message, and data
  res.status(status).json({
    status: false,
    message,
    data,
  });
}

function handleApiValidation(req, res, data, message, status) {
  logHelper.create({
    req,
    response: {
      status: false,
      message,
      data,
    },
  });
  res.status(status).json({
    status: false,
    message,
    data,
  });
}

/**
 * Handles API error response.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Error} error - The error object.
 * @param {string} message - The error message to be included in the response.
 * @param {number} status - The HTTP status code of the response.
 */
function handleApiError(req, res, error, message, status) {
  // Check if the status code corresponds to a server error (500)

  if (status >= 400 && status < 500) {
    logHelper.create({
      req,
      response: {
        status: false,
        message,
        data: error,
      },
    });
  }
  res.status(status).json({
    status: false,
    message,
    error: error ?? {},
  });
}

module.exports = {
  handleApiSuccess,
  handleApiError,
  handleApiValidation,
  handleApiSuccessNoData,
};
