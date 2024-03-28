/// <reference path='../../../types.d.ts' />
import { Request, Response } from "express";

import { Route, handleErrorResponse, sendDataResponse } from '../../../express-server-lib';
import * as Logger from '../../../utils/logger';
import { getTaskByIdQuery, updateTaskQuery } from "../../../databaseQueries/tasks";
const logger = Logger.default("User-ADD API");

export const updateTask:Route = {
    isRoute: true,
    path: "/update",
    method: "post",
    handlers: [
        async(req:Request,res: Response):Promise<void> => {
            try {
                const {taskId,title,status,description} = req.body;
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
                await updateTaskQuery({
                    updateBy: {
                        id: taskId
                    },
                    updateFields: {
                        title,
                        description,
                        status
                    }
                })

                //Get updated task
                const updatedTask = await getTaskByIdQuery(taskId);

                return sendDataResponse(updatedTask,res);

            } catch (error) {
                logger.fatal("error,", error);
                return handleErrorResponse(<Error> error,res);
            }
        }
    ]
}