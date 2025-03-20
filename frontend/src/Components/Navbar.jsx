import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../Context/AppContext";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData, setUserData, backendUrl } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token && token !== 'false') {
        try {
          const { data } = await axios.get(`${backendUrl}/api/users/get-profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (data.success) {
            setUserData(data.user);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          if (error.response?.status === 401) {
            handleLogout();
          }
        }
      }
    };

    fetchUserProfile();
  }, [token, backendUrl]);

  const handleLogout = () => {
    setToken(null);
    setUserData(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-50">
      <div className="flex items-center justify-between text-sm py-4 border-b border-b-gray-100 px-4 md:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <img
          onClick={() => navigate("/")}
          className="w-28 sm:w-32 md:w-44 cursor-pointer"
          src={assets.logo}
          alt="Logo"
        />

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-3 lg:gap-8 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
          >
            <li className="py-1 hover:text-blue-500 transition-colors">HOME</li>
          </NavLink>
          <NavLink
            to="/doctors"
            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
          >
            <li className="py-1 hover:text-blue-500 transition-colors">
              ALL DOCTORS
            </li>
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
          >
            <li className="py-1 hover:text-blue-500 transition-colors">ABOUT</li>
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
          >
            <li className="py-1 hover:text-blue-500 transition-colors">
              CONTACT
            </li>
          </NavLink>
        </ul>

        <div className="flex items-center gap-4">
          {token && token !== 'false' && userData ? (
            <div className="flex items-center gap-2 cursor-pointer group relative">
              <img
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                src={userData.image || '/default-avatar.png'}
                alt={userData.name}
              />
              
              <img className="w-2 md:w-2.5" src={assets.dropdown_icon} alt="Dropdown" />
              
              <div className="absolute top-0 right-0 pt-12 md:pt-14 text-sm md:text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                <div className="min-w-36 md:min-w-48 bg-white rounded-lg flex flex-col gap-2 p-3 md:p-4 shadow-lg border border-gray-100">
                  <p
                    onClick={() => navigate("/my-profile")}
                    className="hover:text-blue-500 cursor-pointer transition-colors py-1"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("/my-appointments")}
                    className="hover:text-blue-500 cursor-pointer transition-colors py-1"
                  >
                    My Appointments
                  </p>
                  <p
                    onClick={handleLogout}
                    className="hover:text-blue-500 cursor-pointer transition-colors py-1"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 text-white px-4 md:px-6 lg:px-8 py-2 md:py-2.5 text-sm md:text-base rounded-full font-medium hidden md:block hover:bg-blue-600 transition-colors"
            >
              Create account
            </button>
          )}

          {/* Mobile Create Account Button */}
          {(!token || token === 'false') && (
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-500 text-white px-4 py-2 text-sm rounded-full font-medium md:hidden hover:bg-blue-600 transition-colors"
            >
              Create account
            </button>
          )}

          {/* Mobile Menu Button */}
          <button onClick={() => setShowMenu(true)} className="md:hidden">
            <img className="w-6" src={assets.menu_icon} alt="Menu" />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
            showMenu ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setShowMenu(false)}
        >
          {/* Mobile Menu Content */}
          <div
            className={`fixed right-0 top-0 h-full w-[280px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
              showMenu ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <img className="w-28" src={assets.logo} alt="Logo" />
              <button 
                onClick={() => setShowMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <img className="w-5" src={assets.cross_icon} alt="Close" />
              </button>
            </div>

            <ul className="flex flex-col p-4">
              <NavLink
                to="/"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg ${
                    isActive ? "bg-blue-50 text-blue-500" : "hover:bg-gray-50"
                  }`
                }
              >
                HOME
              </NavLink>
              <NavLink
                to="/doctors"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg ${
                    isActive ? "bg-blue-50 text-blue-500" : "hover:bg-gray-50"
                  }`
                }
              >
                ALL DOCTORS
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg ${
                    isActive ? "bg-blue-50 text-blue-500" : "hover:bg-gray-50"
                  }`
                }
              >
                ABOUT
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg ${
                    isActive ? "bg-blue-50 text-blue-500" : "hover:bg-gray-50"
                  }`
                }
              >
                CONTACT
              </NavLink>
              {token && token !== 'false' && userData && (
                <>
                  <NavLink
                    to="/my-profile"
                    onClick={() => setShowMenu(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-lg ${
                        isActive ? "bg-blue-50 text-blue-500" : "hover:bg-gray-50"
                      }`
                    }
                  >
                    MY PROFILE
                  </NavLink>
                  <NavLink
                    to="/my-appointments"
                    onClick={() => setShowMenu(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-lg ${
                        isActive ? "bg-blue-50 text-blue-500" : "hover:bg-gray-50"
                      }`
                    }
                  >
                    MY APPOINTMENTS
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMenu(false);
                    }}
                    className="px-4 py-3 text-left rounded-lg hover:bg-gray-50"
                  >
                    LOGOUT
                  </button>
                </>
              )}
              {(!token || token === 'false') && (
                <button
                  onClick={() => {
                    navigate("/login");
                    setShowMenu(false);
                  }}
                  className="mt-4 w-full bg-blue-500 text-white px-4 py-3 rounded-full hover:bg-blue-600 transition-colors font-medium"
                >
                  Create account
                </button>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
