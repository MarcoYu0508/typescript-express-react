import express, { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { ApiController } from "../controllers/ApiController";

export class Route {
    router: Router;
    authMiddleware: AuthMiddleware;
    authController: AuthController;
    apiController: ApiController;

    constructor() {
        this.router = express.Router();
        this.authMiddleware = new AuthMiddleware;
        this.authController = new AuthController;
        this.apiController = new ApiController;

        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        // this.router.get('*', this.authMiddleware.checkUser);
        this.router.get('/', this.authMiddleware.requireAuth, (req, res) => {
            res.json({ data: "welcome" });
        })
        this.router.post('/auth/login', this.authController.validate("login"), this.authController.loginPost);

        this.router.get('/users', this.authMiddleware.requireAuth, this.apiController.usersGet);
    }
}