import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetailPage from "@/pages/ProductDetail";
import CategoryPage from "@/pages/CategoryPage";
import CartPage from "@/pages/Cart";
import CheckoutPage from "@/pages/Checkout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ErrorPage from "@/pages/Error";
import TrackingPage from "@/pages/TrackingPage";
import OrdersPage from "@/pages/Orders";
import FavoritesPage from "@/pages/Favorites";
import ProfilePage from "@/pages/Profile";
import BlogList from "@/pages/BlogList";
import BlogDetail from "@/pages/BlogDetail";
import CreateBlog from "@/pages/CreateBlog";
import PersonalizedRecommendation from "@/pages/PersonalizedRecommendation";
import OurStory from "@/pages/OurStory";
import Sustainability from "@/pages/Sustainability";
import Press from "@/pages/Press";
import Careers from "@/pages/Careers";
import FAQ from "@/pages/FAQ";
import ShippingReturns from "@/pages/ShippingReturns";
import TrackOrder from "@/pages/TrackOrder";
import ContactUs from "@/pages/ContactUs";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminCategories from "@/pages/admin/Categories";
import AdminOrders from "@/pages/admin/Orders";
import AdminUsers from "@/pages/admin/Users";
import AdminBlogs from "@/pages/admin/Blogs";

import { createBrowserRouter } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminRoute from "@/components/auth/AdminRoute";
import shopLoader from "./loaders/shopLoader";
import productLaoder from "./loaders/productLaoder";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/blog",
        Component: BlogList,
      },
      {
        path: "/blog/:slug",
        Component: BlogDetail,
      },
      {
        path: "/for-you",
        Component: PersonalizedRecommendation,
      },
      {
        path: "/blog/create",
        element: (
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        ),
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
        path: "/category/:slug",
        Component: CategoryPage,
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/favorites",
        element: (
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tracking/:orderId",
        element: (
          <ProtectedRoute>
            <TrackingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/signup",
        Component: Register,
      },
      {
        path: "/our-story",
        Component: OurStory,
      },
      {
        path: "/sustainability",
        Component: Sustainability,
      },
      {
        path: "/press",
        Component: Press,
      },
      {
        path: "/careers",
        Component: Careers,
      },
      {
        path: "/faq",
        Component: FAQ,
      },
      {
        path: "/shipping",
        Component: ShippingReturns,
      },
      {
        path: "/track-order",
        Component: TrackOrder,
      },
      {
        path: "/contact",
        Component: ContactUs,
      },
      {
        path: "/admin",
        element: (
          <AdminRoute />
        ),
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                index: true,
                Component: AdminDashboard,
              },
              {
                path: "products",
                Component: AdminProducts,
              },
              {
                path: "categories",
                Component: AdminCategories,
              },
              {
                path: "orders",
                Component: AdminOrders,
              },
              {
                path: "users",
                Component: AdminUsers,
              },
              {
                path: "blogs",
                Component: AdminBlogs,
              },
            ],
          },
        ],
      },
    ],
  },
]);
