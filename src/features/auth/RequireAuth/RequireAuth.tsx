import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../authSlice";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth() {
    const token = useSelector(selectCurrentToken);
    const location = useLocation();

    return (
        token
            ? <Outlet />
            : <Navigate to='/login' state={{ from: location }} replace />
    );
}

export default RequireAuth;
