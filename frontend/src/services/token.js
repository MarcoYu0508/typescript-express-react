const getLocalAccessToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token;
}

const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
}

const removeUser = () => {
    localStorage.removeItem("user");
}

const getUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        if (checkTokenExpired(user)) {
            removeUser();
            return null;
        }
    }   
    return user;
};

const checkTokenExpired = (user) => {
    const dateNow = new Date();
    return user.exp * 1000 < dateNow.getTime()
}

const TokenService = {
    getLocalAccessToken,
    getUser,
    setUser,
    removeUser,
};

export default TokenService;