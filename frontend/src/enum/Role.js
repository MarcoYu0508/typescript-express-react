import Enum from './enum';

export default class Role {
    static roles = {
        Developer: new Enum(0, "Developer"),
        Admin: new Enum(1, "Admin"),
        Normal: new Enum(2, "Normal"),
    };

    static getById(id) {
        // return Role.roles.find(r => r.id === id);
        return Object.values(Role.roles).find((role) => {
            return role.id === id
        });
    }

    static getByKet(key) {
        // return Role.roles.find(r => r.key === key);
        return Object.values(Role.roles).find((role) => {
            return role.key === key
        });
    }
}