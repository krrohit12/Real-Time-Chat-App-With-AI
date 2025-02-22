import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import * as authMiddleware from '../middleware/auth.middleware.js'
const router = Router();

// User registration route with validation
router.post(
    "/register",
    body("email").isEmail().withMessage("Email must be a valid email "),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    userController.createUserController
);

router.post(
    "/login",
    body("email").isEmail().withMessage("Email must be a valid email "),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    userController.logincontroller
);
router.get(
    '/profile',
    authMiddleware.authUser,
    userController.profilecontroller);

router.get("/logout", (req, res) => {
     res.clearCookie("token", { httpOnly: true, sameSite: "None", secure: true });
    res.status(200).json({ message: "Logged out successfully" });
});
router.get(
    '/all',
    authMiddleware.authUser,
    userController.getAllUsersController
)

export default router;
