import { Routing } from '../../../express-server-lib';
import { addUser } from './addUser';
import { loginUser } from './loginUser';

const userRouting: Routing = {
  isRoute: false,
  url: '/user',
  childRoutes: [
   addUser,
   loginUser
  ],
};

export default userRouting;