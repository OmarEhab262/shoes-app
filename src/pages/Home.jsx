import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useUserData } from "../hooks/useData";

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

  return (
    <>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 justify-items-center  ">
        {data &&
          data?.map((item) => (
            <div key={item.id} className="w-full">
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
