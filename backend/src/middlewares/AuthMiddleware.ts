import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import 'dotenv/config';

export class AuthMiddleware {
    userRepo: UserRepository;

    constructor() {
        this.userRepo = new UserRepository;
    }

    requireAuth = async (req: Request, res: Response, next: NextFunction) => {
        const authorization: string | undefined = req.header("authorization");

        if (!authorization) {
            res.status(401).json({
                errors: [
                    {
                        msg: "Token not found",
                    },
                ],
            });
            return;
        }
        // Authenticate token
        const token = authorization.split(' ')[1];
        try {
            const user = verify(token!, String(process.env.TokenSecret));
            console.log(user);
            next();
        } catch (error) {
            res.status(403).json({
                errors: [
                    {
                        msg: "Invalid token",
                    },
                ],
            });
        }
    }

    requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
        const authorization: string | undefined = req.header("authorization");

        if (!authorization) {
            res.status(401).json({
                errors: [
                    {
                        msg: "Token not found",
                    },
                ],
            });
            return;
        }
        // Authenticate token
        const token = authorization.split(' ')[1];
        try {
            const _user: any = verify(token!, String(process.env.TokenSecret));
            const user = await this.userRepo.getUserByAccount(_user.account);
            if (user.role > UserRepository.ADMIN) {
                res.status(403).json({
                    errors: [
                        {
                            msg: "Invalid token",
                        },
                    ],
                });
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(403).json({
                errors: [
                    {
                        msg: "Invalid token",
                    },
                ],
            });
        }
    }
}
