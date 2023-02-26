import axios from "axios";
import React, { useState } from "react";

const Login = () => {
	const [user, setUser] = useState(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			// Send login request to server
			const { data } = await axios.post(
				"http://localhost:8080/login",
				{
					email,
					password,
				},
				{ withCredentials: true }
			);

			setUser(data.data);
		} catch (error) {
			setError(error.message);
		}
	};

	return <div>Login</div>;
};

export default Login;
