import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./components/AppShellLayout";
import { HomePage } from "./pages/HomePage";
import { VenuesPage } from "./pages/Venues";
import { VenueDetailPage } from "./pages/VenueDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CreateVenuePage } from "./pages/CreateVenuePage";
import { EditVenuePage } from "./pages/EditVenuePage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/venues", element: <VenuesPage /> },
      { path: "/venue/:id", element: <VenueDetailPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/create-venue", element: <CreateVenuePage /> },
      { path: "/edit-venue/:id", element: <EditVenuePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
