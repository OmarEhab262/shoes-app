import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useUserData } from "../hooks/useData";
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import { useState } from "react";
const Home = () => {
  const user = useSelector((state) => state.user);
  localStorage.setItem("user", JSON.stringify(user));
  const userrr = JSON.parse(localStorage.getItem("user"));
  if (userrr) {
    console.log("userrr email: ", userrr.email);
  } else {
    console.log("No user found in localStorage.");
  }

  console.log("user: ", user);
  const { data } = useUserData();

  const [currentBanner, setCurrentBanner] = useState(banner1);

  setTimeout(() => {
    setCurrentBanner(currentBanner === banner1 ? banner2 : banner1);
  }, 1500);

  return (
    <>
      <div className="banner w-full h-[70vh] my-5">
        <img
          src={currentBanner}
          alt="Banner"
          className="w-full h-[70vh] object-cover"
        />
      </div>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 justify-items-center ">
        {data &&
          data?.map((item) => (
            <div key={item.id}>
              <Link to={`/details/${item.id}`}>
                <Card
                  item={item}
                  imageUrl={item.imageUrl}
                  name={item.name}
                  price={item.price}
                  type={item.type}
                  color={item.color}
                />
              </Link>{" "}
            </div>
          ))}
      </div>
    </>
  );
};

export default Home;
