/// <reference path='../../../types.d.ts' />
import { Request, Response } from "express";

import { Route, handleErrorResponse, sendDataResponse } from '../../../express-server-lib';
import * as Logger from '../../../utils/logger';
import { deleteTaskQuery, getTaskByIdQuery, updateTaskQuery } from "../../../databaseQueries/tasks";
const logger = Logger.default("User-ADD API");

export const deleteTask:Route = {
    isRoute: true,
    path: "/:taskId",
    method: "delete",
    handlers: [
        async(req:Request,res: Response):Promise<void> => {
            try {
                const {taskId} = req.params;
                const {id} = req.user;

                const task = await getTaskByIdQuery(taskId);

                if(!task){
                    return handleErrorResponse(
                        {
                          status: 404,
                          message: `Task not found`,
                        },
                        res
                    );
                }
                if(task.user_id !== id) {
                    return handleErrorResponse(
                        {
                          status: 401,
                          message: `You dont have access to this task`,
                        },
                        res
                    );
                }
                await deleteTaskQuery(taskId)


                return sendDataResponse({message:'Task deleted successfully'},res);

            } catch (error) {
                logger.fatal("error,", error);
                return handleErrorResponse(<Error> error,res);
            }
        }
    ]
}