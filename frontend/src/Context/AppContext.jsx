import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";


export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = '$';
  const backendUrl= import.meta.env.VITE_BACKEND_URL
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const getDoctorsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/doctor/list`);
      if (response.data.success) {
        setDoctors(response.data.doctors);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      if (error.code === 'ERR_CONNECTION_REFUSED') {
        toast.error('Cannot connect to server. Please check if server is running.');
      } else {
        toast.error(error.response?.data?.message || 'Error fetching doctors');
      }
    }
  };

  const loadUserProfileData = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${backendUrl}/api/users/get-profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setUserData(response.data.userData);
        setUser(response.data.userData); // Also update user state with profile data
      } else {
        toast.error(response.data.message);
        // Clear user data if profile fetch fails
        setUserData(null);
        setUser(null);
        setToken(null);
        // localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      if (error.code === 'ERR_CONNECTION_REFUSED') {
        toast.error('Cannot connect to server. Please check if server is running.');
      } else {
        toast.error(error.response?.data?.message || 'Error loading profile');
      }
      // Clear user data if profile fetch errors
      setUserData(null);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  const loginUser = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${backendUrl}/api/users/login`, formData);
      
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        localStorage.setItem('token', response.data.token);
        setUser(userData);
        setToken(newToken);
        setUserData(userData); // Set userData immediately after login
        return true;
      } else {
        setError(response.data.message);
        return false;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);
  
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(null);
      setUser(null);
    }
  }, [token]);

  const value = {
    doctors,
    setDoctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    user,
    loading,
    error,
    loginUser,
    userData,
    setUserData,
    loadUserProfileData
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;