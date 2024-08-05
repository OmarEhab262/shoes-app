import { useEffect, useState } from "react";
import axiosUser from "../config/axiosUser";

const Inbox = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosUser.get("/users");
        setData(response.data); // Set data from response
      } catch (err) {
        setError(err); // Set error if there is one
      } finally {
        setLoading(false); // Set loading to false regardless of success or error
      }
    };

    fetchData(); // Call the function to fetch data
  }, []); // Empty dependency array to run the effect only once on mount

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  // Process data to get users with cart items
  const usersWithCart = data
    .filter((user) => user.cart && Object.keys(user.cart).length > 0)
    .map((user) => {
      const cartItems = Object.values(user.cart);
      const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return {
        email: user.email,
        quantity: totalQuantity,
        price: totalPrice.toFixed(2),
      };
    });

  // Calculate total price for all users
  const grandTotalPrice = usersWithCart
    .reduce((sum, user) => sum + parseFloat(user.price), 0)
    .toFixed(2);

  return (
    <>
      <div className="pb-8">
        <h1>Inbox</h1>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                User Email
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {usersWithCart.length > 0 ? (
              usersWithCart.map((user, index) => (
                <tr
                  key={index}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">{user.quantity}</td>
                  <td className="px-6 py-4">${user.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {usersWithCart.length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-600 flex *:">
            <div
              colSpan="2"
              className="pl-6 pr-3 py-4 font-medium text-gray-900 dark:text-white text-right"
            >
              Total Price (USD):
            </div>
            <div className=" py-4 font-medium  text-green-600">
              ${grandTotalPrice}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Inbox;
