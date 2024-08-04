import { Heart, ShoppingCart } from "lucide-react";
import nike from "../assets/nike.png";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useUserData } from "../hooks/useData";
import Favorites from "./Favorites";
import AOS from "aos";
import "aos/dist/aos.css";
import Cart from "../pages/Cart";
import axiosUser from "../config/axiosUser";
import { useCounter } from "../context/CounterContext";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [isOpenFavorite, setIsOpenFavorite] = useState(false);
  const [isOpenCart, setIsOpenCart] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const { counterCart, counterFavorite } = useCounter();

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with desired duration
    AOS.refresh(); // Refresh AOS to apply animations to dynamically added elements
  }, [isOpenFavorite, isOpenCart]);

  const fetchUserData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user ? user.id : null;

      if (!userId) {
        console.error("No user ID found");
        return;
      }

      const response = await axiosUser.get(`/users/${userId}`);
      const currentUser = response.data;

      setFavoritesCount(Object.keys(currentUser.favorites).length);
      setCount(Object.keys(currentUser.cart).length);
      localStorage.setItem(
        "cartCount",
        Object.keys(currentUser.cart).length.toString()
      );
    } catch (error) {
      console.error("Error updating counts:", error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [counterCart, counterFavorite]);

  const toggleFavorites = () => {
    setIsOpenFavorite(!isOpenFavorite);
    setIsOpenCart(false);
    fetchUserData(); // Fetch user data when toggling favorites
  };

  const toggleCart = () => {
    setIsOpenCart(!isOpenCart);
    setIsOpenFavorite(false);
    fetchUserData(); // Fetch user data when toggling cart
  };

  const navigate = useNavigate();
  const { refetch } = useUserData();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleChange = (e) => {
    const category = e.target.innerText.toLowerCase();

    localStorage.removeItem("categorize");
    localStorage.setItem("categorize", category);
    refetch();
    navigate(`/categorize/${category}`);
  };
  const logOut = () => {
    localStorage.setItem("isLogged", JSON.stringify(false));
    localStorage.clear();
    window.location.reload();
  };
  return (
    <div className="overflow-hidden">
      <nav className="bg-[#F6F6F6] border-gray-200 px-5">
        <div className="p-4 md:flex block">
          <div className="flex items-center space-x-3 rtl:space-x-reverse justify-between md:w-2/3 w-full">
            <Link to="/" className="flex items-center">
              <img src={nike} className="h-8" alt="NIKE Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">
                NIKE
              </span>
            </Link>
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-default"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          <div
            className={`categories text-black  md:flex md:items-center md:justify-between md:w-full ${
              isOpen ? "flex flex-col" : "hidden"
            } md:flex md:flex-row`}
            id="navbar-default"
          >
            <ul className="flex flex-col md:flex-row p-4 gap-7 font-medium">
              <NavLink
                to="/"
                onClick={handleChange}
                className={({ isActive }) =>
                  isActive ? "text-blue-500 font-bold" : "text-black"
                }
              >
                All
              </NavLink>
              <NavLink
                to="/categorize/man"
                onClick={handleChange}
                className={({ isActive }) =>
                  isActive ? "text-blue-500 font-bold" : "text-black"
                }
              >
                Man
              </NavLink>
              <NavLink
                to="/categorize/woman"
                onClick={handleChange}
                className={({ isActive }) =>
                  isActive ? "text-blue-500 font-bold" : "text-black"
                }
              >
                Woman
              </NavLink>
              <NavLink
                to="/categorize/kids"
                onClick={handleChange}
                className={({ isActive }) =>
                  isActive ? "text-blue-500 font-bold" : "text-black"
                }
              >
                Kids
              </NavLink>
            </ul>

            <div className="flex gap-3">
              <button
                className="text-white px-3 py-1 rounded-lg bg-red-600"
                onClick={logOut}
              >
                Logout
              </button>
              <div className="relative">
                <Heart
                  color="black"
                  onClick={toggleFavorites}
                  className="cursor-pointer"
                />
                {favoritesCount > 0 && (
                  <div className="absolute  inline-flex text-[10px] items-center justify-center w-2 h-2 text-white right-0 top-5 bg-green-600 rounded-full"></div>
                )}
              </div>
              <div className="relative">
                <ShoppingCart
                  color="black"
                  onClick={toggleCart}
                  className="cursor-pointer"
                />
                {count > 0 && (
                  <div className="absolute  inline-flex text-[10px] items-center justify-center w-2 h-2 text-white -right-1 top-5 bg-red-600 rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div
        data-aos={`${isOpenFavorite ? "fade-left" : "fade-right"}`}
        className={` ${
          isOpenFavorite ? "absolute top-15 right-0 z-20" : "hidden"
        }`}
      >
        <Favorites />
      </div>
      <div
        data-aos={`${isOpenCart ? "fade-left" : "fade-right"}`}
        className={` ${isOpenCart ? "absolute top-15 right-0 z-20" : "hidden"}`}
      >
        <Cart />
      </div>
    </div>
  );
};

export default Nav;
