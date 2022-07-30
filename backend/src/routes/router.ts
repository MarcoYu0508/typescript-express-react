import express, { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { UserController } from "../controllers/UserController";

export class Route {
    router: Router;
    authMiddleware: AuthMiddleware;
    authController: AuthController;
    userController: UserController;

    constructor() {
        this.router = express.Router();
        this.authMiddleware = new AuthMiddleware;
        this.authController = new AuthController;
        this.userController = new UserController;

        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        // this.router.get('*', this.authMiddleware.checkUser);
        this.router.get('/', this.authMiddleware.requireAuth, (req, res) => {
            res.json({ data: "welcome" });
        })
        this.router.post('/auth/login', this.authController.validate("login"), this.authController.loginPost);

        this.router.get('/users', this.authMiddleware.requireAdmin, this.userController.usersGet);
        this.router.post('/user/create', this.authMiddleware.requireAdmin, this.userController.validate('create-user'), this.userController.createUser);
        this.router.delete('/user/delete', this.authMiddleware.requireAdmin, this.userController.validate('delete-user'), this.userController.deleteUser);
        this.router.patch('/user/update', this.authMiddleware.requireAdmin, this.userController.validate('update-user'), this.userController.updateUser);
    }
}