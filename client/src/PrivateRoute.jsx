import axios from "axios";
import React from "react";
import { useCookies } from "react-cookie";

const Login = () => {
	const [cookie, setCookie, removeCookie] = useCookies();

	function deleteCookie(name) {
		document.cookie =
			name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	}

	const handleLogout = async (event) => {
		event.preventDefault();

		try {
			// Send login request to server

			const response = await axios.post(
				"http://localhost:8080/logout",
				{},
				{
					withCredentials: true,
				}
			);

			console.log(response);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div>
			<h1>THIS IS FOR LOGGED IN USERS ONLY</h1>
			<button onClick={handleLogout}>LOGOUT</button>
		</div>
	);
};

export default Login;
