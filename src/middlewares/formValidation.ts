import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as Logger from '../utils/logger';
import { handleErrorResponse } from '../express-server-lib';

const logger = Logger.default('form validation');

const formValidation = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors.array());
        let errorMessage = '';
        errors.array().forEach((e) => {
            errorMessage += `${e.msg}, `;
        });
        return handleErrorResponse({ status: 400, message: errorMessage }, res);
    }
    return next();
};

export default formValidation;
