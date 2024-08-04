import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, redirectPath }) => {
  const isLogged = useSelector((state) => state.user.isLogged);
  console.log("isLogged: ", isLogged);

  if (!isLogged) return <Navigate to={redirectPath} replace />;
  return children;
};

// Define PropTypes for the component
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // children should be a React node (e.g., JSX elements)
  redirectPath: PropTypes.string.isRequired, // redirectTo should be a string
};

export default ProtectedRoute;
