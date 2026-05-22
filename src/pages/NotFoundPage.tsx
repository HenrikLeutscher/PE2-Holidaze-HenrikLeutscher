import { useEffect } from "react";
import { NavLink } from "react-router";

export function NotFoundPage() {
  useEffect(() => {
    document.title = "404 Not Found | Holidaze";
  }, []);
  return (
    <div className="shadow-2xl text-center h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-red-500 font-bold">
        404 - The page you are looking for does not exist or has been removed.
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
