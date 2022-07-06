import { UserRepository } from "../repositories/UserRepository";

const userRepository = new UserRepository;

(async () => {
    // const users = await userRepository.getAllUsers();
    // console.log(users);
    const user = await userRepository.create("游孟修", "marco", "marco0508");
    console.log(user);
    process.exit();
})();