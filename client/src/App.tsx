import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
// import "./App.css";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import VerifyEmail from "./auth/VerifyEmail";
import MainLayout from "./layout/MainLayout";
import HeroSection from "./components/HeroSection";
import Profile from "./pages/Profile";
import SearchPage from "./pages/SearchPage";
import RestauranrDetails from "./pages/RestauranrDetails";
import Cart from "./pages/Cart";
import OrdersList from "./pages/OrdersList";
import OrderDetails from "./pages/OrderDetails";
import Restaurant from "./admin/Restaurant";
import AddMenu from "./admin/AddMenu";
import Orders from "./admin/Orders";
import Success from "./pages/Success";
import React, { useEffect } from "react";
import Loading from "./components/Loading";
import { useUserStore } from "./store/useUserStore";
import { useThemeStore } from "./store/useThemeStore";
const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};

const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user?.admin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: <HeroSection />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/search/:text",
        element: <SearchPage />,
      },
      {
        path: "/restaurant/:id",
        element: <RestauranrDetails />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/orders",
        element: <OrdersList />,
      },
      {
        path: "/order/:id",
        element: <OrderDetails />,
      },
      {
        path: "/order/status",
        element: <Success />,
      },
      // admin services pages
      {
        path: "/admin/restaurant",
        element: (
          <AdminRoute>
            <Restaurant />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/menu",
        element: (
          <AdminRoute>
            <AddMenu />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <AdminRoute>
            <Orders />
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <AuthenticatedUser>
        <Login />
      </AuthenticatedUser>
    ),
  },
  {
    path: "/SignUp",
    element: (
      <AuthenticatedUser>
        <SignUp />
      </AuthenticatedUser>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <AuthenticatedUser>
        <ForgotPassword />
      </AuthenticatedUser>
    ),
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
]);

function App() {
  const { checkingAuthentication, isCheckingAuth } =
    useUserStore();
  const initializeTheme = useThemeStore((state: any) => state.initializeTheme);
  useEffect(() => {
    initializeTheme();
    const userData = localStorage.getItem("user-name");
    // Check isAuthenticated status from localStorage
    if (userData) {
      const userObject = JSON.parse(userData);
      // authenticated = userObject.state.isAuthenticated
      if (userObject.state.isAuthenticated) {
        // If user is authenticated, you can set state or do other things
        // console.log(userObject.isAuthenticated);
        // console.log(userObject);

        console.log("User is authenticated");
      } else {
        // console.log(userObject);
        console.log("User is not authenticated");
      }
    }
    checkingAuthentication();
  }, []);

  if (isCheckingAuth) return <Loading />;

  return (
    <main>
      <RouterProvider router={appRouter}></RouterProvider>
    </main>
  );
}

export default App;
