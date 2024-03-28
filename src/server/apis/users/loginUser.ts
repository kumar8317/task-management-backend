import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  Route,
  handleErrorResponse,
  sendDataResponse,
} from "../../../express-server-lib";
import * as Logger from "../../../utils/logger";
import { body } from "express-validator";
import formValidation from "../../../middlewares/formValidation";
import {
  getUserByEmail,
} from "../../../databaseQueries/users";
const logger = Logger.default("User-Login API");

export const loginUser: Route = {
  isRoute: true,
  path: "/login",
  method: "post",
  handlers: [
    /**
     * Form Validation
     */
    body("email").exists({ checkFalsy: true }).withMessage("Email is required"),
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password")
      .exists({ checkFalsy: true })
      .withMessage("Password is required"),
    formValidation,

    async (req: Request, res: Response): Promise<void> => {
      try {
        const { email, password } = req.body;

        let user = await getUserByEmail(email);
        if (!user) {
          return handleErrorResponse(
            {
              status: 401,
              message: `Invalid Credentials`,
            },
            res
          );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return handleErrorResponse(
            {
              status: 401,
              message: `Invalid Credentials`,
            },
            res
          );
        }
        // Generate JWT token
        const payload = {
          user: {
            email: user.email,
            id: user.id,
          },
        };
        const jwtSecret = process.env.JWT_SECRET || "defaultsecret";
        const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });

        return sendDataResponse(token, res);
      } catch (error) {
        logger.fatal("error,", error);
        return handleErrorResponse(<Error>error, res);
      }
    },
  ],
};
