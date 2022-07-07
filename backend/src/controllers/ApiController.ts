import { Request, Response } from 'express';
import { body, validationResult, Result, ValidationError, ValidationChain } from 'express-validator'
import { UserRepository } from '../repositories/UserRepository';

const userRepo = new UserRepository;

export class ApiController {

    usersGet = async (req: Request, res: Response) => {
        const users = await userRepo.getAllUsers();
        res.status(200).json(users);
    }
}