import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import App from "./App";
import { useAuth } from "./AuthContext";

const GuardRoute = () => {
	const { user } = useAuth();
	const location = useLocation();

	if (user) {
		return <Outlet />;
	} else {
		return <Navigate to="/" replace state={{ from: location }} />;
	}
};

export default GuardRoute;
