import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import axiosUser from "../config/axiosUser";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Editproduct = () => {
  const admin = useSelector((state) => state.user.name);
  const productId = localStorage.getItem("productId");
  const [numberOfColors, setNumberOfColors] = useState(0);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [gender, setGender] = useState("");
  const [reviews, setReviews] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product details when component mounts
    if (productId) {
      axiosUser
        .get(`/products/${productId}`)
        .then((response) => {
          const product = response.data;
          setName(product.name);
          setPrice(product.price);
          setDescription(product.description);
          setImageUrl(product.imageUrl);
          setGender(product.type);
          setReviews(product.reviews);
          setSizes(product.sizes);
          setColors(
            Object.entries(product.color).map(([name, url]) => ({ name, url }))
          );
          setNumberOfColors(Object.keys(product.color).length);
        })
        .catch((error) => {
          console.error("Failed to fetch product details", error);
          toast.error("Failed to fetch product details");
        });
    }
  }, [productId]);

  const handleNumberChange = (e) => {
    const number = parseInt(e.target.value) || 0;
    setNumberOfColors(number);
    setColors(Array(number).fill({ name: "", url: "" }));
  };

  const handleColorChange = (index, key, value) => {
    const newColors = [...colors];
    newColors[index] = {
      ...newColors[index],
      [key]: value,
    };
    setColors(newColors);
  };

  const handleNumberChangeSizes = (e) => {
    const number = parseInt(e.target.value) || 0;
    setSizes(Array(number).fill(""));
  };

  const handleSizeChange = (index, value) => {
    const newSizes = [...sizes];
    newSizes[index] = value;
    setSizes(newSizes);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleReviewsChange = (e) => {
    setReviews(e.target.value);
  };

  const handleUpdateProduct = () => {
    const colorObject = colors.reduce((acc, color) => {
      if (color.name && color.url) {
        acc[color.name] = color.url;
      }
      return acc;
    }, {});

    const product = {
      name,
      color: colorObject,
      price: parseFloat(price),
      description,
      imageUrl,
      sizes,
      reviews: parseInt(reviews) || 0,
      type: gender,
    };

    axiosUser
      .put(`/products/${productId}`, product)
      .then((res) => {
        console.log("Product updated", res);
        toast.success("Product updated successfully");
        navigate("/dashboard/products");
      })
      .catch((error) => {
        console.error("Failed to update product", error);
        toast.error("Failed to update product");
      });
  };

  return (
    <>
      <div className="pb-8">
        <h1>Edit Product</h1>
      </div>

      <div className="inputs grid grid-cols-6 gap-4">
        <div className="relative col-span-3">
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Name Product
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="peer py-3 px-4 block w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="relative col-span-3">
          <label
            htmlFor="price"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            className="peer py-3 px-4 block w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Enter Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="relative col-span-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Description
          </label>
          <textarea
            type="text"
            rows="5"
            name="description"
            id="description"
            className="peer py-3 px-4 block w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="relative col-span-6">
          <label
            htmlFor="mainImg"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Main Image
          </label>
          <input
            type="text"
            name="mainImg"
            id="mainImg"
            className="peer py-3 px-4 block w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Enter Main Image"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <div className="relative col-span-6">
          <label
            htmlFor="color"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Color
          </label>
          <input
            type="number"
            name="color"
            id="color"
            className="peer py-3 px-4 block w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Enter Number of colors"
            onChange={handleNumberChange}
          />
        </div>
        {colors.map((color, index) => (
          <React.Fragment key={index}>
            <div className="relative col-span-3">
              <label
                htmlFor={`nameColor-${index}`}
                className="block text-sm font-medium mb-2 dark:text-white"
              >
                Name Color {index + 1}
              </label>
              <input
                type="text"
                name={`nameColor-${index}`}
                id={`nameColor-${index}`}
                className="peer py-3 px-4 block w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="Enter Color Name"
                value={color.name}
                onChange={(e) =>
                  handleColorChange(index, "name", e.target.value)
                }
              />
            </div>
            <div className="relative col-span-3">
              <label
                htmlFor={`colorUrl-${index}`}
                className="block text-sm font-medium mb-2 dark:text-white"
              >
                Color Url {index + 1}
              </label>
              <input
                type="text"
                name={`colorUrl-${index}`}
                id={`colorUrl-${index}`}
                className="peer py-3 px-4 block w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="Enter Color URL"
                value={color.url}
                onChange={(e) =>
                  handleColorChange(index, "url", e.target.value)
                }
              />
            </div>
          </React.Fragment>
        ))}
        <div className="relative col-span-6">
          <label
            htmlFor="size"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Sizes
          </label>
          <input
            type="number"
            name="size"
            id="size"
            className="peer py-3 px-4 block w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Enter Number of sizes"
            onChange={handleNumberChangeSizes}
          />
        </div>
        {sizes.map((size, index) => (
          <div key={index} className="relative col-span-3">
            <label
              htmlFor={`size-${index}`}
              className="block text-sm font-medium mb-2 dark:text-white"
            >
              Size {index + 1}
            </label>
            <input
              type="text"
              name={`size-${index}`}
              id={`size-${index}`}
              className="peer py-3 px-4 block w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              placeholder="Enter Size"
              value={size}
              onChange={(e) => handleSizeChange(index, e.target.value)}
            />
          </div>
        ))}
        <div className="relative col-span-6">
          <label
            htmlFor="gender"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Gender
          </label>
          <select
            name="gender"
            id="gender"
            className="peer py-3 px-4 block w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            value={gender}
            onChange={handleGenderChange}
          >
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
        <div className="relative col-span-6">
          <label
            htmlFor="reviews"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Reviews
          </label>
          <input
            type="number"
            name="reviews"
            id="reviews"
            className="peer py-3 px-4 block w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Enter Reviews"
            value={reviews}
            onChange={handleReviewsChange}
          />
        </div>
        <button
          onClick={handleUpdateProduct}
          className="col-span-6 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Update Product
        </button>
      </div>
    </>
  );
};

export default Editproduct;
