import { useQuery } from "react-query";
import axiosUser from "../config/axiosUser";

const fetchUsers = async (nameId) => {
  const response = await axiosUser.get(`/products/${nameId}`);
  return response.data;
};
export const useNameData = (nameId) => {
  return useQuery(["users-id", nameId], () => fetchUsers(nameId));
};
