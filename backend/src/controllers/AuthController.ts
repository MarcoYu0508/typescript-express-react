import { Request, Response } from 'express';
import { body, validationResult, Result, ValidationError, ValidationChain } from 'express-validator'
import { UserRepository } from '../repositories/UserRepository';
import { sign } from 'jsonwebtoken';

const userRepo = new UserRepository;

const maxAge = Number(process.env.TokenAge);

export class AuthController {

    private createToken = (id: string, name: string, account: string, role: number): string => {
        return sign({ id, name, account, role }, String(process.env.TokenSecret), { expiresIn: maxAge });
    }

    private validationErrors = (validation: Result<ValidationError>) => {
        let errors: any = {};
        validation.array().forEach(error => {
            errors[error.param] = error.msg;
        });
        return errors;
    }

    loginPost = async (req: Request, res: Response) => {
        const {
            account,
            password
        } = req.body;

        const validation = validationResult(req);

        if (!validation.isEmpty()) {
            res.status(422).json({
                errors: this.validationErrors(validation)
            });
            return;
        }

        try {
            const user = await userRepo.checkUser(account, password);
            const token = this.createToken(user.id, user.name, user.account, user.role);
            res.status(200).json({
                token
            });
        } catch (err: any) {
            const errors = this.handleErrors(err);
            res.status(422).json({
                errors
            });
        }
    };

    // handle errors
    private handleErrors = (err: Error) => {
        let errors = {
            account: "",
            password: ""
        }

        // incorrect email
        if (err.message === 'incorrect account') {
            errors.account = '該帳號未註冊';
        }

        // incorrect password
        if (err.message === 'incorrect password') {
            errors.password = '密碼錯誤';
        }
        return errors;
    }

    validate = (method: string): ValidationChain[] => {
        switch (method) {
            case "login":
                return [
                    body('account', '請輸入帳號').exists(),
                    body('password')
                        .matches(/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,20}/)
                        .withMessage('請輸入長度8~20，至少含1個英文字母的密碼'),
                ];
            default:
                return [];
        }
    }

}