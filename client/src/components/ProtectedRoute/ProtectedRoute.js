import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const [isAuth, setIsAuth] = useState(null);
  useEffect(() => {
    const checkAuthentication = async () => {
      const response = await axios("/authenticated");
      if (response.data) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    };
    checkAuthentication();
  });

  return isAuth === null ? null : isAuth === true ? (
    <Outlet />
  ) : isAuth === false ? (
    <Navigate to="/login" />
  ) : null;
};

export default ProtectedRoutes;
