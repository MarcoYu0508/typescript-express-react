import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserRepository } from "../repositories/UserRepository";
import 'dotenv/config';

const userRepository = new UserRepository;

export class AuthMiddleware {
    requireAuth = async (req: Request, res: Response, next: NextFunction) => {
        // const token = req.signedCookies.iroad_djtech;

        // if (token) {
        //     console.log(verify(token, String(process.env.TokenSecret)));
        //     next();
        // } else {
        //     res.redirect('/login');
        // }
        const token = req.header("x-auth-token");
        if (!token) {
            res.status(401).json({
                errors: [
                    {
                        msg: "Token not found",
                    },
                ],
            });
        }
        // Authenticate token
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

    checkUser = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.signedCookies.iroad_djtech;

        if (token) {
            console.log(verify(token, String(process.env.TokenSecret)));
            // verify(token, process.env.TokenSecret, async (err, decodedToken) => {
            //     if (err) {
            //         console.log(err.message);
            //         res.locals.user = null;
            //         next();
            //     } else {
            //         let user = await User.findOne({
            //             where: {
            //                 account: decodedToken.account
            //             }
            //         });
            //         res.locals.user = user;
            //         next();
            //     }
            // });
            next();
        } else {
            res.locals.user = null;
            next();
        }
    }
}
