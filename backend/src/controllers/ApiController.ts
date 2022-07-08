import { Request, Response } from 'express';
import { body, validationResult, Result, ValidationError, ValidationChain } from 'express-validator'
import { UserRepository } from '../repositories/UserRepository';
import { ValidationErrorItem } from 'sequelize';

const userRepo = new UserRepository;

export class ApiController {

    usersGet = async (req: Request, res: Response) => {
        const users = await userRepo.getAllUsers();
        res.status(200).json(users);
    }

    createUser = async (req: Request, res: Response) => {
        const { name, account, password, role } = req.body;

        const validation = validationResult(req);

        if (!validation.isEmpty()) {
            res.status(422).json({
                errors: this.validationErrors(validation)
            });
            return;
        }

        try {
            const user = await userRepo.create(name, account, password, role);
            res.status(200).json(user);
        } catch (error: any) {
            const errors: any = {};

            if (error.errors != undefined && error.errors.length > 0) {
                for (const err of error.errors) {
                    const _err: ValidationErrorItem = err;
                    if (_err) {
                        errors[_err.path!] = _err.message;
                    }
                }
            }
            res.status(422).json({ errors });
        }
    }

    deleteUser = async (req: Request, res: Response) => {
        const { id } = req.body;
        console.log(req.body);

        const validation = validationResult(req);

        if (!validation.isEmpty()) {
            res.status(422).json({
                errors: this.validationErrors(validation)
            });
            return;
        }

        try {
            const deleted = await userRepo.deleteUser(id);
            if (deleted) {
                res.status(200).send("success");
            } else {
                res.status(422).json({ errors: { "user": "無使用者" } });
            }
        } catch (error: any) {
            console.log(error);
            res.status(500).json({ errors: { "user": "刪除失敗" } });
        }
    }

    private validationErrors = (validation: Result<ValidationError>) => {
        let errors: any = {};
        validation.array().forEach(error => {
            errors[error.param] = error.msg;
        });
        return errors;
    }

    validate = (method: string): ValidationChain[] => {
        switch (method) {
            case "create-user":
                return [
                    body('name', '請輸入名稱').exists(),
                    body('account', '請輸入帳號').exists(),
                    body('password')
                        .matches(/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,20}/)
                        .withMessage('請輸入長度8~20，至少含1個英文字母的密碼'),
                    body('role', '請選則角色').exists(),
                ];
            case "delete-user":
                return [
                    body('id', '請輸入id').exists().isUUID(),
                ]
            default:
                return [];
        }
    }
}