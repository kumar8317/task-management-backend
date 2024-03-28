import { Routing } from '../../../express-server-lib';
import { addTask } from './add';
import { deleteTask } from './delete';
import { getAllTasks, getTaskById, getTasksByUser } from './get';
import { updateTask } from './update';

const taskRouting: Routing = {
  isRoute: false,
  url: '/task',
  childRoutes: [
    getTasksByUser,
   getAllTasks,
   addTask,
   updateTask,
   deleteTask,
   getTaskById,
   
  ],
};

export default taskRouting;