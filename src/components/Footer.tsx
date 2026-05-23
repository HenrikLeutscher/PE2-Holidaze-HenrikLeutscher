import { NavLink } from "react-router-dom";
import holidazeLogo from "../assets/logo/holidaze.png";

export function Footer() {
  return (
    <footer className="bg-primary text-white py-4 mt-auto items-center text-center">
      <div className="flex justify-center mb-2">
        <NavLink to={"/"}>
          <img
            src={holidazeLogo}
            alt="Holidaze Logo"
            className="w-[15vw] min-w-30"
          />
        </NavLink>
      </div>
      <p className="text-header3">@ 2026 Holidaze. All rights reserved.</p>
    </footer>
  );
}
