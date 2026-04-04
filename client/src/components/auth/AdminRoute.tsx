import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

const AdminRoute = () => {
  const { user, token, status } = useAppSelector((state) => state.auth);

  // If status is loading OR we have a token but haven't fetched the user yet (on page refresh), wait.
  if (status === "loading" || (token && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return user && user.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
