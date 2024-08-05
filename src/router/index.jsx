import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import RootLayout from "../pages/Layout";
import Login from "../pages/Login";
import ProtectedRoute from "../auth/ProtectedRoute";
import Home from "../pages/Home";
import ErrorHandler from "../components/errors/ErrorHandler";
import SignUp from "../pages/SignUp";
import Details from "../pages/Details";
import Categories from "../pages/Categories";
import AdminRoute from "../auth/AdminRoute";
import DashboardLayout from "../pages/DashboardLayout";
import DashboardHome from "../components/DashboardHome";
import Inbox from "../pages/Inbox";
import Users from "../pages/Users";
import Products from "../pages/Products";
import Editproduct from "../pages/Editproduct";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />} errorElement={<ErrorHandler />}>
        <Route
          index
          element={
            <ProtectedRoute redirectPath="/login">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="details/:nameId"
          element={
            <ProtectedRoute redirectPath="/login">
              <Details />
            </ProtectedRoute>
          }
        />
        <Route
          path="Categorize/:nameCategorize"
          element={
            <ProtectedRoute redirectPath="/login">
              <Categories />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="/dashboard"
        element={
          <AdminRoute redirectPath="/login">
            <DashboardLayout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="editproduct" element={<Editproduct />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
    </>
  )
);

export default router;
