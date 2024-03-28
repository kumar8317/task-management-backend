import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import {
  Route,
  handleErrorResponse,
  sendDataResponse,
} from "../../../express-server-lib";
import * as Logger from "../../../utils/logger";
import { body } from "express-validator";
import formValidation from "../../../middlewares/formValidation";
import { getUserByEmail, insertUsersTx } from "../../../databaseQueries/users";
const logger = Logger.default("User-ADD API");

export const addUser: Route = {
  isRoute: true,
  path: "/signup",
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
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one digit")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[$&+,:;=?@#|'<>.^*()%!-]/)
      .withMessage("Password must contain at least one special character"),

    formValidation,

    async (req: Request, res: Response): Promise<void> => {
      try {
        const { email, password } = req.body;

        let user = await getUserByEmail(email);
        if (user) {
          return handleErrorResponse(
            {
              status: 400,
              message: `User already exists`,
            },
            res
          );
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = { id: uuidv4(), email, password: hashedPassword };

        await insertUsersTx(userData);

    
        // Generate JWT token
        const payload = {
          user: {
            email: userData.email,
            id: userData.id,
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
