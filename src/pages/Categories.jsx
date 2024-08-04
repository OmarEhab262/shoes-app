import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useUserData } from "../hooks/useData";

const Categories = () => {
  const user = useSelector((state) => state.user);
  console.log("user: ", user);

  const { data } = useUserData();

  // Get the category from localStorage
  const categorize = localStorage.getItem("categorize") || "all";

  // Filter data based on the category
  const filteredData = data?.filter(
    (item) => categorize === "all" || item.type === categorize
  );

  return (
    <>
      <h1 className="px-7 text-black text-[32px] font-semibold">
        {" "}
        {categorize}'s Shoes & Sneakers{" "}
      </h1>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 justify-items-center">
        {filteredData &&
          filteredData.map((item) => (
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
              </Link>
            </div>
          ))}
      </div>
    </>
  );
};

export default Categories;
