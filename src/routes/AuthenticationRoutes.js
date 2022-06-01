import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "components/general/Loadable";
import { Outlet } from "react-router";

const Login = Loadable(lazy(() => import("pages/authentication/Login")));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

export default function AuthenticationRoutes(user) {
  return {
    path: "/login",
    element: user ? <Navigate to="/control_panel" replace /> : <Login />,
  };
}
