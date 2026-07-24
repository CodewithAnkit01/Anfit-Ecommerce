
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
if (!token) {
  setTimeout(() => {
    toast.warning("Please login first");
  }, 0);

  return <Navigate to="/login" />;
}

  return children;
}