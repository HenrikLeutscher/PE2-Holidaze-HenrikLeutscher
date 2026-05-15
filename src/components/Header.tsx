import { NavLink } from "react-router-dom";
import { House, Compass, User, LogIn, LogOut, SquarePen } from "lucide-react";
import { useAuth } from "../context/useAuth";

export function Header() {
  const { user, logout, token } = useAuth();
  const userLoggedIn = Boolean(user || token);
  const venueManager = user?.venueManager;

  return (
    <header className="bg-primary flex w-full items-center justify-between py-6 text-white">
      <div className="flex justify-between container mx-auto">
        <div>
          <NavLink to={"/"}>
            <img
              src="/src/assets/logo/holidaze.png"
              alt="Holidaze Logo"
              className="w-50"
            />
          </NavLink>
        </div>
        <div className="flex gap-5">
          <NavLink to={"/"} className="flex items-center">
            <House />
            <span>Home</span>
          </NavLink>
          <NavLink to={"venues"} className="flex items-center">
            <Compass />
            <span>Venues</span>
          </NavLink>
        </div>
        <div className="flex gap-5">
          {userLoggedIn ? (
            <>
              {!venueManager && (
                <NavLink to={"/create-venue"} className="flex items-center">
                  <SquarePen />
                  <span>Create Venue</span>
                </NavLink>
              )}
              <NavLink to={"profile"} className="flex items-center">
                <User />
                <span>Profile</span>
              </NavLink>

              <button className="flex items-center" onClick={logout}>
                <LogOut />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to={"login"} className="flex items-center">
                <LogIn />
                <span>Log In</span>
              </NavLink>
              <NavLink to={"register"} className="flex items-center">
                <span>Register</span>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
