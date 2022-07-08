import decode from "jwt-decode"

const setAccessToken = (token) => {
  localStorage.setItem("token", token);
}

const getAccessToken = () => {
  return localStorage.getItem("token");
}

const removeToken = () => {
  localStorage.removeItem("token");
}

const getUser = () => {
  const token = localStorage.getItem("token");

  if (token) {
    const decodedToken = decode(token);

    const user = {
      exp: decodedToken.exp,
      id: decodedToken.id,
      name: decodedToken.name,
      account: decodedToken.account,
      role: decodedToken.role
    };
    if (checkTokenExpired(user)) {
      removeToken();
      return null;
    }
    return user;
  }
  return null;
};

const checkTokenExpired = (user) => {
  const dateNow = new Date();
  return user.exp * 1000 < dateNow.getTime()
}

const TokenService = {
  setAccessToken,
  getAccessToken,
  getUser,
  removeToken,
};

export default TokenService;