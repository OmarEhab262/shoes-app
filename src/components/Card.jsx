import PropTypes from "prop-types";

const Card = ({ price, imageUrl, name, type, color }) => {
  // Ensure color is an object and calculate the number of colors
  const numberOfColors =
    color && typeof color === "object" ? Object.keys(color).length : 0;

  return (
    <div className="border border-b-2 w-[300px] text-black m-5">
      <div className="top">
        <img
          src={imageUrl}
          alt={`${name} image`}
          className="h-[300px] w-full object-cover"
        />
      </div>
      <div className="text flex flex-col gap-3 p-3 text-[20px]">
        <h3 className="name font-bold">{name}</h3>
        <h3 className="category text-[20px] text-gray-400">
          {type}&apos;s shoes
        </h3>
        <h3 className="color text-[20px] text-gray-400">
          {numberOfColors} colors
        </h3>
        <h3 className="price font-bold">$ {price}</h3>
      </div>
    </div>
  );
};

Card.propTypes = {
  price: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  color: PropTypes.object.isRequired, // Expecting an object for color
};

export default Card;
