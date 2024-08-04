import { useState } from "react";
import { useMutation } from "react-query";
import axiosUser from "../config/axiosUser";
import Spinner from "../components/ui/Spinner";
import toast from "react-hot-toast";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const checkCredentials = async ({ email, password }) => {
  const response = await axiosUser.get("/users");
  const user = response.data.find(
    (user) => user.email === email && user.password === password
  );
  return user || null; // Returns the user object or null
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { mutate, isLoading, isError } = useMutation(checkCredentials, {
    onSuccess: (user) => {
      if (user) {
        localStorage.setItem("isLogged", JSON.stringify(true));
        const isLogged = JSON.parse(localStorage.getItem("isLogged"));
        dispatch(
          setUser({
            email: user.email,
            password: user.password,
            name: user.name,
            isLogged: isLogged,
            id: user.id,
          })
        );
        localStorage.setItem("userId", user.id);
        toast.success("User logged in successfully");

        navigate("/");
      } else {
        toast.error("Incorrect email or password");
      }
    },
    onError: () => {
      toast.error("An error occurred during login");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <div className="form mt-36">
      <div className="w-full mx-auto my-10 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h5 className="text-xl font-medium text-gray-900">
            Login to your account
          </h5>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="example@gmail.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div>
            <div className="my-3 text-[13px]">
              <p className=" text-black">
                Dont have an account?
                <Link to="/signup" className="text-blue-500 ml-1">
                  Sign up
                </Link>
              </p>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md px-3 py-1 hover:bg-blue-600 w-full"
            >
              {isLoading ? <Spinner /> : <span>Login</span>}
            </button>
          </div>
          {isError && (
            <div className="mt-4 text-red-500">Error during login check</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
