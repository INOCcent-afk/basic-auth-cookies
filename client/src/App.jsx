import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function App() {
	const navigate = useNavigate();

	const { user, setUser } = useAuth();

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

	const [registerName, setRegisterName] = useState("");
	const [registerEmail, setRegisterEmail] = useState("");
	const [registerPassword, setRegisterPassword] = useState("");
	const [registerError, setRegisterError] = useState("");

	const handleRegisterSubmit = async (event) => {
		event.preventDefault();

		try {
			// Send login request to server
			const { data } = await axios.post(
				"http://localhost:8080/register",
				{
					email: registerEmail,
					password: registerPassword,
					name: registerName,
				},
				{
					withCredentials: true,
				}
			);

			setUser(data.data);
		} catch (error) {
			setRegisterError(error.message);
		}
	};

	useEffect(() => {
		if (user) {
			navigate("/protected");
		}
	}, [user]);

	return (
		<div className="App">
			<header className="App-header">
				<p>{error}</p>
				<h1 onClick={() => navigate("/protected")}>Login</h1>
				<form onSubmit={handleSubmit}>
					<br />
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.currentTarget.value)}
						placeholder="email"
						autoComplete="on"
					/>
					<br />
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.currentTarget.value)}
						placeholder="password"
						autoComplete="on"
					/>
					<br />
					<button type="submit">SUBMIT</button>
				</form>

				<br />

				<h1>REGISTER</h1>
				<form onSubmit={handleRegisterSubmit}>
					<input
						type="text"
						value={registerName}
						onChange={(e) => setRegisterName(e.currentTarget.value)}
						placeholder="name"
					/>
					<br />
					<input
						type="email"
						value={registerEmail}
						onChange={(e) =>
							setRegisterEmail(e.currentTarget.value)
						}
						placeholder="email"
					/>
					<br />
					<input
						type="password"
						value={registerPassword}
						onChange={(e) =>
							setRegisterPassword(e.currentTarget.value)
						}
						placeholder="password"
						autoComplete="on"
					/>
					<br />
					<button type="submit">SUBMIT</button>
				</form>
			</header>
		</div>
	);
}

export default App;
