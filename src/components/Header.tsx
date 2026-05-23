import { useNavigate, NavLink } from "react-router-dom";
import holidazeLogo from "../assets/logo/holidaze.png";
import {
  House,
  Compass,
  User,
  LogIn,
  LogOut,
  SquarePen,
  Menu,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useState } from "react";

export function Header() {
  const { user, logout, token } = useAuth();
  const userLoggedIn = Boolean(user || token);
  const venueManager = user?.venueManager;
  const [dropDownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="bg-primary flex w-full items-center justify-between py-6 text-white">
      <div className="flex justify-between container mx-auto items-center">
        <div>
          <NavLink to={"/"}>
            <img
              src={holidazeLogo}
              alt="Holidaze Logo"
              className="w-[10vw] min-w-30"
            />
          </NavLink>
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-5">
          <NavLink to={"/"} className="flex items-center">
            <House />
            <span className="text-bodytext">Home</span>
          </NavLink>
          <NavLink to={"venues"} className="flex items-center">
            <Compass />
            <span className="text-bodytext">Venues</span>
          </NavLink>
        </div>
        <div className="hidden md:flex gap-5">
          {userLoggedIn ? (
            <>
              {venueManager && (
                <NavLink to={"/create-venue"} className="flex items-center">
                  <SquarePen />
                  <span className="text-bodytext">Create Venue</span>
                </NavLink>
              )}
              <NavLink to={"profile"} className="flex items-center">
                <User />
                <span className="text-bodytext">Profile</span>
              </NavLink>

              <button className="flex items-center" onClick={handleLogout}>
                <LogOut />
                <span className="text-bodytext">Log Out</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to={"login"} className="flex items-center">
                <LogIn />
                <span className="text-bodytext">Log In</span>
              </NavLink>
              <NavLink to={"register"} className="flex items-center">
                <UserPlus />
                <span className="text-bodytext">Register</span>
              </NavLink>
            </>
          )}
        </div>
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Menu
            className="w-10 h-10"
            onClick={() => setDropdownOpen(!dropDownOpen)}
          />
          {dropDownOpen && (
            <div className="absolute w-full right-0 top-20 bg-primary rounded shadow-lg p-4 flex flex-col gap-3 z-100">
              <NavLink
                to={"/"}
                className="flex items-center"
                onClick={() => setDropdownOpen(false)}
              >
                <House />
                <span className="text-bodytext">Home</span>
              </NavLink>
              <NavLink
                to={"venues"}
                className="flex items-center"
                onClick={() => setDropdownOpen(false)}
              >
                <Compass />
                <span className="text-bodytext">Venues</span>
              </NavLink>
              {!userLoggedIn && (
                <div className="border-y-2 border-gray-300 py-2 gap-3 flex flex-col">
                  <NavLink
                    to={"login"}
                    className="flex items-center"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LogIn />
                    <span className="text-bodytext">Log In</span>
                  </NavLink>
                  <NavLink
                    to={"register"}
                    className="flex items-center"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <UserPlus />
                    <span className="text-bodytext">Register</span>
                  </NavLink>
                </div>
              )}
              {userLoggedIn && (
                <div className="border-y-2 border-gray-300 py-2 gap-5 flex flex-col">
                  {venueManager && (
                    <NavLink
                      to={"/create-venue"}
                      className="flex items-center"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <SquarePen />
                      <span className="text-bodytext">Create Venue</span>
                    </NavLink>
                  )}
                  <NavLink
                    to={"profile"}
                    className="flex items-center"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User />
                    <span className="text-bodytext">Profile</span>
                  </NavLink>
                  <button
                    className="flex items-center"
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    <LogOut />
                    <span className="text-bodytext">Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
