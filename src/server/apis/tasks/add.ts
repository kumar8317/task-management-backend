/// <reference path='../../../types.d.ts' />
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { Route, handleErrorResponse, sendDataResponse } from '../../../express-server-lib';
import * as Logger from '../../../utils/logger';
import { body } from "express-validator";
import formValidation from "../../../middlewares/formValidation";
import { TaskDetails, TaskStatus } from "../../../databaseQueries/declaration";
import { insertTasksTx } from "../../../databaseQueries/tasks";
const logger = Logger.default("User-ADD API");

export const addTask:Route = {
    isRoute: true,
    path: "/add",
    method: "post",
    handlers: [
        /**
         * Form Validation 
         */
        body('title')
            .exists({ checkFalsy: true })
            .withMessage('Title is required'),
        
        formValidation,

        async(req:Request,res: Response):Promise<void> => {
            try {
                const {title,description} = req.body;
                const {id} = req.user;

                const taskData: TaskDetails = {
                    id: uuidv4(),
                    title,
                    description,
                    user_id: id,
                    status: TaskStatus.ToDo
                }

                await insertTasksTx(taskData);

                return sendDataResponse(taskData,res);

            } catch (error) {
                logger.fatal("error,", error);
                return handleErrorResponse(<Error> error,res);
            }
        }
    ]
}