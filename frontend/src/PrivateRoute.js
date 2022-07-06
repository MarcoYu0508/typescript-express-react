
import { Navigate, Outlet } from "react-router-dom";
import TokenService from "./services/token";

const PrivateRoute = ({ children }) => {
    const user = TokenService.getUser();
    return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;