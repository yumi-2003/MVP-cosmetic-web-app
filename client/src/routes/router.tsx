import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetailPage from "@/pages/ProductDetail";
import CartPage from "@/pages/Cart";
import CheckoutPage from "@/pages/Checkout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { createBrowserRouter } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import shopLoader from "./loaders/shopLoader";
import productLaoder from "./loaders/productLaoder";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/shop",
        Component: Shop,
        loader: shopLoader,
      },
      {
        path: "/product/:id",
        Component: ProductDetailPage,
        loader: productLaoder,
      },
      {
        path: "/cart",
        Component: CartPage,
      },
      {
        path: "/checkout",
        Component: CheckoutPage,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/signup",
        Component: Register,
      },
    ],
  },
]);
