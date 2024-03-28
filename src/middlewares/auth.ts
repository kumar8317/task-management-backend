import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

import { handleErrorResponse } from "../express-server-lib";
import * as Logger from '../utils/logger';

const logger = Logger.default("Auth");

const checkBearerToken = async( req:Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body && req.body.headers && req.body.headers.authorization) {
        req.headers.authorization = req.body.headers.authorization;
    }

    if(req.headers.authorization && req.headers.authorization.split(" ")[0] === 'Bearer'){
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            const jwtSecret = process.env.JWT_SECRET || 'defaultsecret';
            const decoded = jwt.verify(token, jwtSecret);

            if (decoded && typeof decoded === 'object' && 'user' in decoded && 'id' in decoded.user) {
                req.user = {
                    id: decoded.user.id,
                    email: decoded.user.email
                }
                return next();
            } else {
                throw new Error('Invalid token payload');
            }
        } catch (error) {
            logger.error(error);
            return handleErrorResponse(<Error>error, res); 
        }
    }else{
        return handleErrorResponse(
            {status:401, message: 'Authorization Header missing'},
            res
        )
    }
}

export default checkBearerToken