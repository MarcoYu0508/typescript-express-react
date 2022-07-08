import { Navigate, useRoutes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// pages
import NotFound from '../pages/Page404';
import DashboardApp from '../pages/DashboardApp';
import Login from '../pages/Login';
import User from '../pages/User';
import Products from '../pages/Products';
import Blog from '../pages/Blog';
import Home from '../pages/Home';

const Router = () => {
    return useRoutes([
        {
            path: '/dashboard',
            element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
            // element: <DashboardLayout />,
            children: [
                { path: '', element: <Navigate to="/dashboard/app" /> },
                { path: 'app', element: <DashboardApp /> },
                { path: 'user', element: <AdminRoute><User /></AdminRoute> },
                { path: 'products', element: <Products /> },
                { path: 'blog', element: <Blog /> },
            ],
        },
        {
            path: '/',
            element: <LogoOnlyLayout />,
            children: [
                { path: '/', element: <Navigate to="/dashboard/app" /> },
                { path: 'login', element: <Login /> },
                // { path: 'register', element: <Register /> },
                { path: '404', element: <NotFound /> },
                { path: '*', element: <Navigate to="/404" /> },
            ],
        },
        { path: '*', element: <Navigate to="/404" replace /> },
    ]);
}

export default Router;