import api from "./api";
import TokenService from "./token";

const login = async (account, password) => {
  const res = await api.post('/auth/login', { account, password });
  TokenService.setAccessToken(res.data.token);
}

const logout = () => {
  TokenService.removeToken();
};

const AuthService = {
  login,
  logout
}

export default AuthService;