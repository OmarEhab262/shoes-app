import { useParams } from "react-router-dom";
import { useNameData } from "../hooks/useNameData";
import { Heart, MoveLeft, Star } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import axiosUser from "../config/axiosUser";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { useCounter } from "../context/CounterContext";
const Details = () => {
  const { nameId } = useParams();
  const { data, refetch } = useNameData(nameId);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const user = useSelector((state) => state.user);
  const rating = data?.reviews || 0;
  const { incrementFavorite, incrementCart } = useCounter();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    if (data?.color && !selectedColor) {
      const firstColor = Object.keys(data.color)[0];
      setSelectedColor(firstColor);
    }
  }, [data?.color, selectedColor]);

  useEffect(() => {
    AOS.refresh();
  }, [selectedColor]);

  const goBack = () => {
    window.history.back();
  };

  const handleAddToCart = async () => {
    const imageUrl = data.color[selectedColor];

    // Create the cart item object
    const cartItem = {
      id: data.id, // Use the product ID for reference
      name: data.name,
      color: selectedColor,
      size: selectedSize,
      price: data.price,
      imageUrl,
      quantity: 1,
    };

    try {
      // Fetch current user data
      const response = await axiosUser.get(`/users/${user.id}`);
      const currentUser = response.data;

      // Generate a new cart item ID
      const newItemId = uuidv4();

      // Update cart with the new item
      const updatedCart = {
        ...currentUser.cart,
        [newItemId]: cartItem, // Use the new numerical ID as the key
      };

      // Update user data with the new cart
      await axiosUser.put(`/users/${user.id}`, {
        ...currentUser,
        cart: updatedCart,
      });

      refetch();
      console.log(`Added to cart:
        Name: ${cartItem.name}
        Color: ${cartItem.color}
        Price: $${cartItem.price}
        Size: ${cartItem.size}
        Image: ${cartItem.imageUrl}
        User ID: ${user.id}
      `);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Item added to cart.");

      incrementCart();
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleAddToFavorites = async () => {
    if (!user.id) {
      toast.error("User not authenticated.");
      return;
    }

    const imageUrl = data.color[selectedColor];

    const favoriteItem = {
      id: data.id,
      name: data.name,
      color: selectedColor,
      size: selectedSize,
      price: data.price,
      imageUrl,
    };

    try {
      // Fetch current user data
      const response = await axiosUser.get(`/users/${user.id}`);
      const currentUser = response.data;

      // Initialize favorites if undefined
      const currentFavorites = currentUser.favorites || {};

      // Find the next favorite ID

      const newFavoriteId = uuidv4();

      // Update favorites
      const updatedFavorites = {
        ...currentFavorites,
        [newFavoriteId]: favoriteItem,
      };

      // Save updated user data
      await axiosUser.put(`/users/${user.id}`, {
        ...currentUser,
        favorites: updatedFavorites,
      });

      // Save the updated favorites in localStorage
      localStorage.setItem(
        "favorites",
        JSON.stringify(Object.keys(updatedFavorites).length) // Use updatedFavorites
      );

      toast.success("Added to favorites!");
      incrementFavorite();
      // Refresh the user data to ensure the UI is up-to-date
      refetch(); // Ensure refetch updates the favorites count in Nav
    } catch (error) {
      console.error(
        "Error updating favorites:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      <div className="w-full text-black">
        <div
          className="flex justify-center gap-3 cursor-pointer"
          onClick={goBack}
        >
          <MoveLeft /> <span>BACK</span>
        </div>
      </div>
      <div className="text-black flex justify-between bg-[#F6F6F6] p-10 flex-col md:flex-row">
        <div className="right md:w-1/4 w-full gap-5 flex flex-col justify-center">
          <div className="name">
            <h1 className="text-[35px] font-bold">{data?.name}</h1>
          </div>
          <div className="description">
            <p>{data?.description}</p>
          </div>
          <div>
            <p className="text-[20px] text-gray-500">
              Running sneakers With thin elastic laces.
            </p>
          </div>
        </div>
        <div className="mid lg:w-1/3 w-full h-[500px] object-cover flex justify-center">
          <img
            key={selectedColor} // Change key when color changes
            data-aos="zoom-in-down"
            src={selectedColor ? data.color[selectedColor] : data?.imageUrl}
            alt=""
            className="h-[500px] object-cover"
          />
        </div>
        <div className="left md:w-1/4 w-full flex flex-col gap-10">
          <div className="size">
            <h2>Size</h2>
            <div className="flex gap-3 flex-wrap">
              {data?.sizes.map((size) => (
                <div
                  key={size}
                  className={`w-[40px] h-[40px] rounded-full ${
                    selectedSize === size
                      ? "bg-gray-600 text-white"
                      : "bg-black text-white"
                  } flex justify-center items-center text-[20px] cursor-pointer`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          <div className="review flex justify-between">
            <h2>Reviews</h2>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  strokeWidth={0}
                  key={index}
                  fill={index < Math.round(rating) ? "gold" : "lightgray"}
                  size={25}
                />
              ))}
            </div>
          </div>
          <div className="price flex justify-between">
            <h2>Price</h2>
            <h3>$ {data?.price}</h3>
          </div>
          <div className="color">
            <h2>Color</h2>
            <div className="flex gap-3 flex-wrap">
              {Object.keys(data?.color || {}).map((color) => (
                <div
                  key={color}
                  className={`w-[50px] h-[50px] rounded-full border-4 cursor-pointer ${
                    selectedColor === color
                      ? "border-gray-800"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                ></div>
              ))}
            </div>
          </div>
          <div className="add flex gap-5 items-center">
            <button
              className="bg-black px-5 py-2 text-white"
              onClick={handleAddToCart}
            >
              Add Cart
            </button>
            <Heart
              color="black"
              className="cursor-pointer"
              onClick={handleAddToFavorites}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
