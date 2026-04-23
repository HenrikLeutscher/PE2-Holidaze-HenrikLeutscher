import { NavLink } from "react-router";

export function NotFoundPage() {
  return (
    <div className="bg-gray-200 text-center h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-red-500 font-bold">
        404 - The page you are looking for does not exist.
      </p>
      <NavLink
        to="/"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Return home
      </NavLink>
    </div>
  );
}
