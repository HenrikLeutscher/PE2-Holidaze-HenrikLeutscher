import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container flex flex-col mx-auto flex-1 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
