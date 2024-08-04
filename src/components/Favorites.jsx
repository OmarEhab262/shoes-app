import { useQueryClient } from "react-query";
import { Heart } from "lucide-react";
import { useUserInfo } from "../hooks/useUserData";
import axiosUser from "../config/axiosUser";
import toast from "react-hot-toast";

const Favorites = () => {
  const queryClient = useQueryClient(); // Use useQueryClient to get the query client instance
  const { data, error, isLoading } = useUserInfo();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching favorites: {error.message}</div>;

  if (!data || !data.favorites) {
    return <div>No favorites found</div>;
  }

  const favoriteItems = data.favorites;
  const handleDelete = async (itemKey) => {
    try {
      // Retrieve user ID from localStorage or context
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user ? user.id : null;

      if (!userId) {
        console.error("No user ID found");
        return;
      }

      // Fetch current user data
      const response = await axiosUser.get(`/users/${userId}`);
      const currentUser = response.data;

      // Remove the item from the favorites list
      const updatedFavorites = { ...currentUser.favorites };
      delete updatedFavorites[itemKey];

      // Update user data with the new favorites
      await axiosUser.put(`/users/${userId}`, {
        ...currentUser,
        favorites: updatedFavorites,
      });

      // Invalidate and refetch the user data to reflect the changes
      queryClient.invalidateQueries(["user", userId]);
      toast.success("Item removed from favorites");

      // Handle the localStorage favorites count
      const favoriteCount = parseInt(
        localStorage.getItem("favorites") || "0",
        10
      );
      localStorage.setItem(
        "favoritesCount",
        Math.max(favoriteCount - 1, 0).toString()
      );
    } catch (error) {
      console.error("Error removing item:", error.message);
      toast.error("Error removing item");
    }
  };

  return (
    <div className="text-black bg-gray-400 h-[80vh] p-3 rounded-md">
      <div className="overflow-y-scroll h-[75vh]">
        <div className="head p-3">
          <h2 className="text-[30px]">
            Favorites{" "}
            <span className="text-[25px] font-bold"> {data.name}</span>
          </h2>
        </div>
        {Object.keys(favoriteItems).length === 0 ? (
          <div className="w-[320px] bg-white h-[200px] rounded-md p-3 m-3 flex justify-center items-center">
            <h1 className="text-[35px] text-center">
              {" "}
              No items in favorites 🥲
            </h1>
          </div>
        ) : (
          Object.entries(favoriteItems).map(([key, item]) => (
            <div
              key={key} // Use item key as the React key
              className="border border-b-2 rounded-xl w-[300px] text-black m-5"
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
                <div className="size">
                  <h3>Size: {item.size}</h3>
                </div>
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <h3>Color: </h3>
                    <div
                      className="color w-5 h-5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                  </div>
                  <Heart
                    color="black"
                    className="cursor-pointer"
                    strokeWidth={0}
                    fill="red"
                    onClick={() => handleDelete(key)} // Pass the key to handleDelete
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
