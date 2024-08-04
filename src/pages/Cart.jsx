import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosUser from "../config/axiosUser";
import { useUserInfo } from "../hooks/useUserData";
import { useQueryClient } from "react-query";

const Cart = () => {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useUserInfo();
  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    if (data?.cart) {
      setCartItems(data.cart);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching cart: {error.message}</div>;

  const handleQuantityChange = async (itemKey, newQuantity) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user ? user.id : null;

      if (!userId) {
        console.error("No user ID found");
        return;
      }

      const response = await axiosUser.get(`/users/${userId}`);
      const currentUser = response.data;

      const updatedCart = {
        ...currentUser.cart,
        [itemKey]: { ...currentUser.cart[itemKey], quantity: newQuantity },
      };

      await axiosUser.put(`/users/${userId}`, {
        ...currentUser,
        cart: updatedCart,
      });

      queryClient.invalidateQueries(["user", userId]);
      toast.success("Quantity updated successfully");

      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error updating quantity:", error.message);
      toast.error("Error updating quantity");
    }
  };

  const handleDelete = async (itemKey) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user ? user.id : null;

      if (!userId) {
        console.error("No user ID found");
        return;
      }

      const response = await axiosUser.get(`/users/${userId}`);
      const currentUser = response.data;

      const updatedCart = { ...currentUser.cart };
      delete updatedCart[itemKey];

      await axiosUser.put(`/users/${userId}`, {
        ...currentUser,
        cart: updatedCart,
      });

      queryClient.invalidateQueries(["user", userId]);
      toast.success("Item removed from cart");

      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error removing item:", error.message);
      toast.error("Error removing item");
    }
  };

  const totalPrice = Object.values(cartItems).reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="text-black bg-gray-400 h-[80vh] rounded-md w-full">
      <div className="overflow-y-scroll h-[75vh] p-3">
        <div className="head p-3">
          <h2 className="text-[30px]">
            Cart <span className="text-[25px] font-bold"> {data?.name}</span>
          </h2>
        </div>
        {Object.keys(cartItems).length === 0 ? (
          <div className="md:w-[320px]  bg-white h-[200px] rounded-md p-3 m-3 flex justify-center items-center">
            <h1 className="text-[35px] text-center">No items in cart 🥲</h1>
          </div>
        ) : (
          Object.entries(cartItems).map(([key, item]) => (
            <div
              key={key}
              className="border border-b-2 rounded-xl md:w-[300px] text-black m-5"
            >
              <div className="img h-[200px]">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-[200px] w-full object-cover rounded-tr-xl rounded-tl-xl"
                />
              </div>
              <div className="p-3">
                <div className="name">
                  <h3>{item.name}</h3>
                </div>
                <div className="price">
                  <h3>Price: $ {item.price}</h3>
                </div>
                <div className="size flex justify-between">
                  <h3>Size: {item.size || "N/A"}</h3>
                  <input
                    type="number"
                    className="text-center pl-3 bg-white w-[50px] rounded-sm"
                    value={item.quantity || 1}
                    min="1"
                    onChange={(e) =>
                      handleQuantityChange(key, parseInt(e.target.value, 10))
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <h3>Color: </h3>
                    <div
                      className="color w-5 h-5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                  </div>

                  <button
                    className=" w-[100px] my-2 bg-red-600 text-white py-1 rounded-md"
                    onClick={() => handleDelete(key)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="bg-gray-300 rounded-br-lg rounded-bl-lg w-full h-[40px] p-3">
        <h3>
          Total: $
          <span className="font-bold text-green-700">
            {totalPrice.toFixed(2)}
          </span>
        </h3>
      </div>
    </div>
  );
};

export default Cart;
