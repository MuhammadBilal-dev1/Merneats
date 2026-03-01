import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header>
        <Navbar />
      </header>
      {/* Main content */}
      <div className="flex-1">
        <Outlet />
      </div>
      {/* footer */}
      <footer >
        <Footer/>
      </footer>
    </div>
  );
};

export default MainLayout;
