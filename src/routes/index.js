import { useRoutes } from "react-router-dom";
import { Navigate } from "react-router";


// routes
import MainRoutes from "./MainRoutes";
import AuthenticationRoutes from "./AuthenticationRoutes";
import config from "config";
import { useState } from "react";

import app from "../firebase";
import Register from "pages/authentication/Register";

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes({user, teacher}) {

  return useRoutes(
    [
      MainRoutes(user, teacher),
      AuthenticationRoutes(user),
      {
        path: "/register",
        element: user ? <Navigate to="/control_panel" replace /> : <Register />,
      }
    ],
    config.basename
  );
}
