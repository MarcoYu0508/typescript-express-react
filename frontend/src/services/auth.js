import api from "./api";
import TokenService from "./token";
import decode from "jwt-decode"

const login = async (account, password) => {
    const res = await api.post('/auth/login', { account, password });
    const decodedToken = decode(res.data.token);
    TokenService.setUser({ 
        exp: decodedToken.exp,
        token: res.data.token, 
        id: decodedToken.id, 
        name: decodedToken.name,
        account: decodedToken.account
    })
}

const logout = () => {
    TokenService.removeUser();
};

const AuthService = {
    login,
    logout
}

export default AuthService;