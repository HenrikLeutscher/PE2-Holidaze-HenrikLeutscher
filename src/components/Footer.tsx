import { NavLink } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-primary text-white py-4 mt-auto items-center text-center">
      <div className="flex justify-center mb-2">
        <NavLink to={"/"}>
          <img
            src="/src/assets/logo/holidaze.png"
            alt="Holidaze Logo"
            className="w-50"
          />
        </NavLink>
      </div>
      <p>@ 2026 Holidaze. All rights reserved.</p>
    </footer>
  );
}
