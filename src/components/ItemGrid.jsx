import React from "react";
import { Link } from "react-router-dom";

const ItemGrid = ({ items, linkPath, displayBig, gridFor }) => {
  let itemID = gridFor === "services" ? "_id" : "id";
  return (
    <>
      {items?.map((item, index) => (
        <div className="flex justify-center" key={item[itemID]}>
          <Link
            to={`${linkPath}/${item[itemID]}`}
            // className={`p-4 flex bg-white cursor-pointer border border-secondary rounded-lg shadow-sm hover:shadow-xl
            //     transition ease-in-out duration-500 ${
            //       displayBig ? `w-32 h-32` : `w-28 h-28`
            //     }`}
            className={`p-4 flex bg-white cursor-pointer border border-secondary rounded-lg shadow-sm hover:shadow-xl 
                transition ease-in-out duration-500 ${
                  displayBig
                    ? `w-32 h-32 max-sm:w-24 max-sm:h-24`
                    : `w-28 h-28 max-sm:w-24 max-sm:h-24`
                }`}
          >
            <img
              src={import.meta.env.VITE_APP_BASE_URL + item?.image}
              alt={item?.name || "Item"}
              className="justify-center"
              // className="justify-center aspect-[3/2] object-contain "
              loading="lazy" // Native lazy loading
            />
            {/* Optional: display item name */}
            {/* <p className="size-4 pt-1">{item?.name}</p> */}
          </Link>
        </div>
      ))}
    </>
  );
};

export default ItemGrid;

// className="w-28 p-4 h-28 flex cursor-pointer border border-secondary rounded-lg shadow-sm hover:shadow-xl transition ease-in-out duration-500"
// className="w-32 p-4 h-32 flex cursor-pointer border border-secondary rounded-lg shadow-sm hover:shadow-xl transition ease-in-out duration-500 bg-white"
