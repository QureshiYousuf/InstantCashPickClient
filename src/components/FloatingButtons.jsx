// FloatingButtons.jsx
import React, { useEffect, useState } from "react";
import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaPhoneAlt,
  FaRecycle,
  FaHome,
} from "react-icons/fa";
import { GiSellCard } from "react-icons/gi";
import { MdHomeRepairService } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useGetCategoryQuery } from "../features/api";
// import { FaPhone } from "react-icons/fa";

const FloatingButtons = () => {
  const { data: categories, categoriesLoading: categoriesLoading } =
    useGetCategoryQuery();

  const defaultMessage =
    "Hi There! Need help to sell on https://instantcashpick.com/";

  const navigate = useNavigate();
  const pathSubStr = location.pathname.substring(0, 4);

  const [activePath, setActivePath] = useState({
    home: false,
    sell: false,
    service: false,
    recycle: false,
  });

  const [showCategories, setShowCategories] = useState(false);

  const activeLink =
    "text-cyan-500 text-lg transition-colors transition-all duration-1000 ease-in-out";

  useEffect(() => {
    // console.log("Updating Active Path");
    switch (pathSubStr) {
      case "/":
        setActivePath({
          home: true,
          sell: false,
          service: false,
          recycle: false,
        });
        break;
      case "/cat":
        setActivePath({
          home: false,
          sell: true,
          service: false,
          recycle: false,
        });
        break;
      case "/sell":
        setActivePath({
          home: false,
          sell: true,
          service: false,
          recycle: false,
        });
        break;
      case "/ser":
        setActivePath({
          home: false,
          sell: false,
          service: true,
          recycle: false,
        });
        break;
      case "/rec":
        setActivePath({
          home: false,
          sell: false,
          service: false,
          recycle: true,
        });
        break;
      default:
        setActivePath(activePath);
    }
  }, [pathSubStr]);

  // console.log("activePath", activePath, "showCategories:", showCategories);

  return (
    <>
      {/* Buttons on right of screen */}
      <div className="fixed bottom-0 h-11 z-10 top-[65%] -translate-y-1/2 right-4 max-sm:right-2 w-auto flex flex-col space-y-4 bg-gray-800 bg-transparent">
        <a
          href={`https://wa.me/+918722288017?text=${defaultMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-none bg-green-500 text-white p-4 max-sm:p-3 w-fit flex justify-center items-center rounded-full shadow-lg hover:bg-green-600 transition "
        >
          <FaWhatsapp className="size-6 max-sm:size-6" />
        </a>
        <a
          href="tel:8722288017"
          className="flex-none bg-blue-500 text-white p-4 max-sm:p-3 w-fit flex justify-center items-center rounded-full shadow-lg hover:bg-blue-600 transition "
        >
          <FaPhoneAlt size={24} />
        </a>
        <a
          href="mailto:instantcashpick@gmail.com"
          className="flex-none bg-red-500 text-white p-4 max-sm:p-3 w-fit flex justify-center items-center rounded-full shadow-lg hover:bg-red-600 transition "
        >
          <FaEnvelope size={24} />
        </a>
      </div>

      <div className="fixed bottom-0 h-[52px] w-full z-10 flex">
        <div className="grid grid-cols-4 border-t shadow-xl bg-white w-full sm:hidden text-sm font-thin">
          {/* Home */}
          <div
            className={`flex justify-center text-center p-2 border-r`}
            onClick={() => {
              navigate("/");
            }}
          >
            <button className="flex flex-col items-center gap-1 text-center">
              <span className={`${activePath.home && activeLink}`}>
                <FaHome />
              </span>
              <span className={`${activePath.home && "font-medium text-xs"}`}>
                Home
              </span>
            </button>
          </div>

          {/* Sell */}
          <div
            className={`relative flex justify-center text-center p-2 border-r`}
            onClick={() => {
              // navigate("/");
              setShowCategories((prev) => !prev);
            }}
          >
            {showCategories && (
              <div
                // className={`absolute -top-[180px] flex flex-col items-center bg-white px-2 rounded py-2 transition-all duration-1000 ease-in `}
                className={`absolute bottom-12 flex flex-col items-center bg-slate-50 border border-black border-b-cyan-50 px-2 rounded-lg py-2 transition-all duration-1000 ease-in `}
              >
                {categories?.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/categories/brands/${cat.id}`}
                    className="py-1 font-[400] hover:font-semibold text-xs border-b w-[100px]"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
            <button className="flex flex-col items-center gap-1 text-center">
              <span className={`${activePath.sell && activeLink}`}>
                <GiSellCard />
              </span>
              <span className={`${activePath.sell && "font-medium text-xs"}`}>
                Sell
              </span>
            </button>
          </div>

          {/* Service */}
          <div
            className={`flex justify-center text-center py-2 border-r`}
            onClick={() => {
              navigate("/services");
            }}
          >
            <button className="flex flex-col items-center gap-1 text-center">
              <span className={`${activePath.service && activeLink}`}>
                <MdHomeRepairService />
              </span>
              <span
                className={`${activePath.service && "font-medium text-xs"}`}
              >
                Services
              </span>
            </button>
          </div>

          {/* Recycle */}
          <div
            className={`flex justify-center text-center p-2`}
            onClick={() => {
              navigate("/recycle-categories");
            }}
          >
            <button className="flex flex-col items-center gap-1 text-center">
              <span className={`${activePath.recycle && activeLink}`}>
                <FaRecycle />
              </span>
              <span
                className={`${activePath.recycle && "font-medium text-xs"}`}
              >
                Recycle
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingButtons;

{
  /* <a
          href={`https://wa.me/+918722288017?text=${defaultMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 lg:flex-none bg-green-500 text-white p-4 flex justify-center items-center lg:rounded-full shadow-lg hover:bg-green-600 transition "
        >
          <FaWhatsapp size={24} />
        </a>
        <a
          href="tel:8722288017"
          className="flex-1 lg:flex-none bg-blue-500 text-white p-4 flex justify-center items-center lg:rounded-full shadow-lg hover:bg-blue-600 transition "
        >
          <FaPhoneAlt size={24} />
        </a>
        <a
          href="mailto:instantcashpick@gmail.com"
          className="flex-1 lg:flex-none bg-red-500 text-white p-4 flex justify-center items-center lg:rounded-full shadow-lg hover:bg-red-600 transition "
        >
          <FaEnvelope size={24} />
        </a> */
}

/* Button on left of screen */
{
  /* <div className="fixed bottom-0 h-11 right-0 w-full z-10 lg:top-[65%] lg:-translate-y-1/2 lg:right-4 lg:w-auto flex lg:flex-col lg:space-y-4 bg-gray-800 lg:bg-transparent">
        <a
          href={`https://wa.me/+918722288017?text=${defaultMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 lg:flex-none bg-green-500 text-white p-4 flex justify-center items-center lg:rounded-full shadow-lg hover:bg-green-600 transition "
        >
          <FaWhatsapp size={24} />
        </a>
        <a
          href="tel:8722288017"
          className="flex-1 lg:flex-none bg-blue-500 text-white p-4 flex justify-center items-center lg:rounded-full shadow-lg hover:bg-blue-600 transition "
        >
          <FaPhoneAlt size={24} />
        </a>
        <a
          href="mailto:instantcashpick@gmail.com"
          className="flex-1 lg:flex-none bg-red-500 text-white p-4 flex justify-center items-center lg:rounded-full shadow-lg hover:bg-red-600 transition "
        >
          <FaEnvelope size={24} />
        </a>
      </div> */
}

// className={`flex justify-center text-center p-2 border-r ${
//   location.pathname.substring(0, 6).includes("/cat")
//     ? ` text-cyan-500 transition-colors duration-1000 ease-in-out `
//     : location.pathname === "/" ||
//       location.pathname.substring(0, 6).includes("/sell")
//     ? ` text-cyan-500 transition-colors duration-1000 ease-in-out `
//     : ``
// }`}
