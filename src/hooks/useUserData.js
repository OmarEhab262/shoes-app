import { useQuery } from "react-query";
import axiosUser from "../config/axiosUser";

const fetchUserById = async (id) => {
  const response = await axiosUser.get(`/users/${id}`);
  return response.data;
};

export const useUserInfo = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Ensure user and user.id exist
  const userId = user ? user.id : null;

  return useQuery(
    ["user", userId],
    () => {
      if (userId) {
        return fetchUserById(userId);
      }
      return Promise.reject("No user ID found");
    },
    {
      // Optionally add configurations like staleTime, cacheTime, etc.
      enabled: !!userId, // Query will only be enabled if userId exists
    }
  );
};
