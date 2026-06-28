import type { RouteObject } from "react-router-dom";
import Home from "../components/pages/Home/Home";
import Login from "../components/pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import ListOrder from "../components/pages/ListOrders";
import DetailOrder from "../components/pages/DetailOrder";
import CreateOrder from "../components/pages/CreateOrder";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/login',
        element: (
            <ProtectedRoute>
                <Login />
            </ProtectedRoute>
        ),
    },
    {
        path: '/orders',
        element: (
            <ProtectedRoute>
                <ListOrder />
            </ProtectedRoute>
        ),
    },
    {
        path: '/order/:id',
        element: (
          <ProtectedRoute>
            <DetailOrder />
          </ProtectedRoute>
        ),
    },
    {
        path: '/create',
        element: (
          <ProtectedRoute>
            <CreateOrder />
          </ProtectedRoute>
        ),
    },

]

export default routes;