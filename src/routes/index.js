import { useRoutes } from "react-router-dom";


// routes
import MainRoutes from "./MainRoutes";
import AuthenticationRoutes from "./AuthenticationRoutes";
import config from "config";
import { useState } from "react";

import app from "../firebase";

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes({user}) {

  return useRoutes(
    [
      MainRoutes(user),
      AuthenticationRoutes(user),
    ],
    config.basename
  );
}
