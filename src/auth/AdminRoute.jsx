import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const AdminRoute = ({ children, redirectPath }) => {
  // Retrieve user info from localStorage or Redux
  const name = localStorage.getItem("userName"); // Adjust based on how you store user data

  // Check if user is an admin
  if (name !== "admin") return <Navigate to={redirectPath} replace />;
  return children;
};

// Define PropTypes for the component
AdminRoute.propTypes = {
  children: PropTypes.node.isRequired, // children should be a React node (e.g., JSX elements)
  redirectPath: PropTypes.string.isRequired, // redirectPath should be a string
};

export default AdminRoute;
