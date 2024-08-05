import { useQuery } from "react-query";
import axiosUser from "../config/axiosUser";

const fetchUsers = async () => {
  const response = await axiosUser.get(`/users`);
  return response.data;
};

export const useGetAllUsers = () => {
  return useQuery(
    // refetch work to get data from server used like function
    "products",
    fetchUsers
  );
};