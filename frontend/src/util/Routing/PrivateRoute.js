import { Navigate, Outlet } from "react-router-dom";
import { getLocalStorage } from "util/Storage/Storage";

function PrivateRoute() {
  const user = getLocalStorage("user");
  return user ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
