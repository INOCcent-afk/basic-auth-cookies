import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext({ user: null, setUser: null });

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const isUserValid = async () => {
		try {
			// Send login request to server
			const { data } = await axios.get(
				"http://localhost:8080/protected",

				{
					withCredentials: true,
				}
			);

			setUser(data.data);
		} catch (error) {}
	};

	useEffect(() => {
		if (!user && pathname !== "/") {
			isUserValid();
			return;
		}

		navigate("/protected");
	}, [user]);

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const { user, setUser } = useContext(AuthContext);

	return { user, setUser };
};
