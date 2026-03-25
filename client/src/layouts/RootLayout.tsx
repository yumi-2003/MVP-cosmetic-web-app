import Footer from "@/components/layout/footer/Footer";
import Navbar from "@/components/layout/navbar/Navbar";
import { Outlet, useLocation } from "react-router";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getMe } from "@/redux/slices/authSlice";
import { fetchCart } from "@/redux/slices/cartSlice";
import { fetchFavorites } from "@/redux/slices/favoriteSlice";

const RootLayout = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getMe());
    }
    if (user) {
      dispatch(fetchCart());
      dispatch(fetchFavorites());
    }
  }, [token, user, dispatch]);

  const hideChrome =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" richColors />
      {!hideChrome && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
};

export default RootLayout;
