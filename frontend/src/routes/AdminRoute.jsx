
import { Navigate } from "react-router-dom";
import TokenService from "../services/token";
import Role from '../enum/Role';

const PrivateRoute = ({ children }) => {
    const user = TokenService.getUser();
    return user.role < Role.roles.Normal.id ? children : <Navigate to="/dashboard" />;
}

export default PrivateRoute;