// punitmudgal/demo-project/demo-project-2afa154242ee139cca055c8bd602faed2f0699d4/src/common/returnResponse.ts

// import logHelper from "../modules/helper/log.helper"; // Assuming logHelper is converted to ES module
import type { Request, Response } from "express";

/**
 * Handles API success response.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {any} data - The data to be included in the response.
 * @param {string} message - The success message to be included in the response.
 * @param {number} status - The HTTP status code of the response.
 */
export function handleApiSuccess(
  req: Request,
  res: Response,
  data: any,
  message: string,
  status: number
) {
  // Log the API success using the apiLogger
  // logHelper.create({
  //   req,
  //   response: {
  //     status: true,
  //     message,
  //     data,
  //   },
  // });
  // Send the success response with the specified status code, message, and data
  res.status(status).json({
    status: true,
    status_code: status,
    message,
    data,
  });
}

export function handleApiSuccessNoData(
  req: Request,
  res: Response,
  data: any,
  message: string,
  status: number
) {
  // Log the API success using the apiLogger
  // logHelper.create({
  //   req,
  //   response: {
  //     status: false,
  //     message,
  //     data,
  //   },
  // });

  // Send the success response with the specified status code, message, and data
  res.status(status).json({
    status: false,
    status_code: status,
    message,
    data,
  });
}

export function handleApiValidation(
  req: Request,
  res: Response,
  data: any,
  message: string,
  status: number
) {
  // logHelper.create({
  //   req,
  //   response: {
  //     status: false,
  //     message,
  //     data,
  //   },
  // });
  res.status(status).json({
    status: false,
    status_code: status,
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
export function handleApiError(
  req: Request,
  res: Response,
  error: any,
  message: string,
  status: number
) {
  // Check if the status code corresponds to a server error (500)

  if (status >= 400 && status < 500) {
    // logHelper.create({
    //   req,
    //   response: {
    //     status: false,
    //     message,
    //     data: error,
    //   },
    // });
  }
  res.status(status).json({
    status: false,
    status_code: status,
    message,
    error: error ?? {},
  });
}
