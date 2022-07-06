import api from "./api";
import TokenService from "./token";

const home = async () => {
    const res = await api.get('');
    return res.data;
}

const leave = () => {
    TokenService.removeUser();
}

const DataService = {
    home,
    leave,
}

export default DataService;