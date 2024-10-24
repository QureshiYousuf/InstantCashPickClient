import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetCategoryQuery } from "../../features/api";
import AllBrandsList from "../brands/AllBrandsList";

const Categories = () => {
  const { data, isLoading } = useGetCategoryQuery();

  // const [mobileCat, setMobileCat] = useState("");

  // useEffect(() => {
  //   if (data) {
  //     const mobile = data.find((d) => d.name.toLowerCase().includes("mobile"));
  //     console.log("mobile", mobile);
  //     setMobileCat(mobile.id);
  //   }
  // });

  return (
    <div className="mt-10 mx-auto">
      <div className="w-4/5 mx-auto">
        <div className="mx-0 mb-6">
          <h1 className="text-2xl pb-6 max-sm:text-lg">
            Ready to sell?{" "}
            <span className="text-3xl text-cyan-500 font-semibold max-sm:text-xl">
              Let's turn your gadgets into cash!
            </span>
          </h1>
          {/* <hr className="text-black mt-1" /> */}
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
            <span>Loading...</span>
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-x-2 gap-y-5 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 w-full mx-auto items-center justify-center text-center relative">
            {data?.map((category, i) => (
              <div className="flex justify-center">
                <Link to={`/categories/brands/${category.id}`} key={i}>
                  <div
                    key={i}
                    // border-[#E27D60]
                    className="w-32 p-4 h-32 flex bg-white cursor-pointer border border-cyan-500 rounded-lg shadow-sm hover:shadow-xl transition ease-in-out duration-500"
                  >
                    <img
                      src={import.meta.env.VITE_APP_BASE_URL + category?.image}
                      alt="CAT"
                      className="justify-center "
                    />
                    {/* <p className="size-4 pt-1">{category?.name}</p> */}
                  </div>
                </Link>
              </div>
            ))}

            {/* RECYCLE */}
            <div className="flex justify-center">
              <Link to={`/recycle-categories`}>
                <div className="w-32 p-4 h-32 flex bg-white cursor-pointer border border-cyan-500 rounded-lg shadow-sm hover:shadow-xl transition ease-in-out duration-500">
                  <img
                    src="/images/recycle1.png"
                    alt="CAT"
                    className="justify-center"
                  />
                  {/* <p className="size-4 pt-1">Recyle</p> */}
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* <div className="mt-16 pt-8 pb-16 bg-cyan-50 px-[10%]">
        <AllBrandsList />
      </div> */}
    </div>
  );
};

export default Categories;
