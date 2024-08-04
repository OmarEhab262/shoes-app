import axios from "axios";

const axiosUser = axios.create({
  baseURL: "http://localhost:4000",
});
export default axiosUser;
