import db from '../models';
import bcrypt from 'bcrypt'

const User = db.User;

export class UserRepository {
    async create(name: string, account: string, password: string, role = 1) {
        const salt = await bcrypt.genSalt();
        const hash_password = await bcrypt.hash(password, salt);
        const user = await User.create({
            name,
            account,
            password: hash_password,
            role
        });
        return user;
    }
    async checkUser(account: string, password: string) {
        const user = await User.findOne({
            where: {
                account: account
            },
        })
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            const _user = {
                id: user.id,
                name: user.name,
                account: user.account,
                role: user.role
            }
            if (auth) {
                return _user;
            }
            throw Error('incorrect password');
        }
        throw Error('incorrect account');
    }
    async getUserByAccount(account: string) {
        return await User.findOne({
            where: {
                account: account
            }
        });
    }
    async getUserById(id: string) {
        return await User.findOne({
            where: {
                id: id
            }
        });
    }
    async getAllUsers() {
        return await User.findAll({
            order: [
                ['id', 'ASC'],
            ],
        });
    }
}