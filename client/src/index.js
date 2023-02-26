import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import GuardRoute from "./GuardRoute";
import { AuthProvider } from "./AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<App />} />
					<Route element={<GuardRoute />}>
						<Route path="/protected" element={<PrivateRoute />} />
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
