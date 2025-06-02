import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from '../services/api';

const authContext = createContext(); // creating the context object it will be to share the state and functions acrous comp

export const useAuth = () => {
	return useContext(authContext);
};
  
// provider for the authContext
const AuthProvider = ({children}) => {
	// const [token, setToken] = useState(localStorage.getItem("token"));
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isloading, setIsloading] = useState(true);

	useEffect( () =>{ //checking if the user is authenticated on component mount
		const token = localStorage.getItem("token");
		if (token){
			// set the token to the header for upcoming request in axios
			// axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			fetchUser();
		} else{
			setIsloading(false);
		}
	}, [])

	const fetchUser = async () => {
		try {
			const response = await axios.get("/api/me");
			setUser(response.data);
			setIsAuthenticated(true);
		} catch (error){
			console.log("fetchUser: ", error);
			setUser(null);
			setIsAuthenticated(false);
			// localStorage.removeItem("token");
			// delete axios.defaults.headers.common["Authorization"];
    		// setIsAuthenticated(false);
		} finally {
			setIsloading(false); //always
		}
	}

	const logout = () => {
		// localStorage.removeItem("token");
		// delete axios.defaults.headers.common["Authorization"];
		// setUser(null);
		// setIsAuthenticated(false);
		console.log("logout func");
	};

	const login = async () => {
		console.log("login func");
	};

	const register = async () => {
		console.log("register func");
	};

	const contextValue = {
		user,
		isAuthenticated,
		isloading,
		logout,
		login,
		register,
	}

	return (<authContext.Provider value={contextValue}>
		{children}
	</authContext.Provider>)
};

export default AuthProvider;