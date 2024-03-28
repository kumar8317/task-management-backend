/// <reference path='../../../types.d.ts' />
import { Request, Response } from "express";

import { Route, handleErrorResponse, sendDataResponse } from '../../../express-server-lib';
import * as Logger from '../../../utils/logger';
import { getAllTasksQuery, getTaskByIdQuery, getTasksByUserQuery } from "../../../databaseQueries/tasks";
const logger = Logger.default("User-ADD API");

export const getTaskById:Route = {
    isRoute: true,
    path: "/:taskId",
    method: "get",
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

                return sendDataResponse(task,res);

            } catch (error) {
                logger.fatal("error,", error);
                return handleErrorResponse(<Error> error,res);
            }
        }
    ]
}

export const getTasksByUser:Route = {
    isRoute: true,
    path: "/user",
    method: "get",
    handlers: [
        async(req:Request,res: Response):Promise<void> => {
            try {
                const {id} = req.user;

                const tasks = await getTasksByUserQuery(id);


                return sendDataResponse(tasks,res);

            } catch (error) {
                logger.fatal("error,", error);
                return handleErrorResponse(<Error> error,res);
            }
        }
    ]
}

export const getAllTasks:Route = {
    isRoute: true,
    path: "/all",
    method: "get",
    handlers: [
        async(req:Request,res: Response):Promise<void> => {
            try {

                const tasks = await getAllTasksQuery();


                return sendDataResponse(tasks,res);

            } catch (error) {
                logger.fatal("error,", error);
                return handleErrorResponse(<Error> error,res);
            }
        }
    ]
}