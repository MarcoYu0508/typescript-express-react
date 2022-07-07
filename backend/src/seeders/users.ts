import { UserRepository } from "../repositories/UserRepository";
import 'dotenv/config';

const userRepository = new UserRepository;

(async () => {
    const developer = await userRepository.create(String(process.env.DEVELOPER_NAME), String(process.env.DEVELOPER_ACC), String(process.env.DEVELOPER_PWD), 0);
    console.log(developer);
    const admin = await userRepository.create(String(process.env.ADMIN_NAME), String(process.env.ADMIN_ACC), String(process.env.ADMIN_PWD), 1);
    console.log(admin);
    const normal = await userRepository.create(String(process.env.NORMAL_NAME), String(process.env.NORMAL_ACC), String(process.env.NORMAL_PWD), 2);
    console.log(normal);
    process.exit();
})();