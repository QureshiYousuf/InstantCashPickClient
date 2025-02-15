// import React from "react";
// import { Link } from "react-router-dom";
// import { useGetCategoryQuery } from "../../features/api/categories/categoriesApi";
// import Loading from "../../components/loader/Loading";
// import ItemGrid from "../../components/ItemGrid";

// const Categories = () => {
//   const { data: categories, categoriesLoading: categoriesLoading } =
//     useGetCategoryQuery();

//   return (
//     // <div className="mt-10 max-sm:mt-5 mx-auto">
//     <div className="w-full mx-auto">
//       <div className="w-4/5 max-sm:w-[92%] mx-auto">
//         <div className="mx-0 mb-6">
//           <h1 className="text-2xl pb-6 max-sm:text-lg">
//             Ready to sell?{" "}
//             <span className="text-3xl text-secondary font-semibold max-sm:text-xl">
//               Let's turn your gadgets into cash!
//             </span>
//           </h1>
//           {/* <hr className="text-black mt-1" /> */}
//         </div>

//         {categoriesLoading ? (
//           <Loading />
//         ) : (
//           <div className="grid grid-cols-6 gap-x-2 gap-y-5 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-3 w-full mx-auto items-center justify-center text-center relative">
//             <ItemGrid
//               items={categories}
//               linkPath="/categories/brands"
//               displayBig={true}
//             />

//             {/* RECYCLE */}
//             <div className="flex justify-center">
//               <Link
//                 to={`/recycle-categories`}
//                 className="w-32 p-4 h-32 max-sm:w-24 max-sm:h-24 flex bg-white cursor-pointer border border-secondary rounded-lg shadow-sm hover:shadow-xl transition ease-in-out duration-500"
//               >
//                 <img
//                   src="/images/recycle1.png"
//                   alt="CAT"
//                   className="justify-center"
//                 />
//                 {/* <p className="size-4 pt-1">Recyle</p> */}
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Categories;

import React from "react";
import { Link } from "react-router-dom";
import { useGetCategoryQuery } from "../../features/api/categories/categoriesApi";
import Loading from "../../components/loader/Loading";
import ItemGrid from "../../components/ItemGrid";

const Categories = () => {
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategoryQuery();

  return (
    <div className="w-full mx-auto">
      <div className="w-4/5 max-sm:w-[92%] mx-auto">
        <div className="mx-0 mb-6">
          <h1 className="text-2xl pb-6 max-sm:text-lg">
            Ready to sell?{" "}
            <span className="text-3xl text-secondary font-semibold max-sm:text-xl">
              Let's turn your gadgets into cash!
            </span>
          </h1>
        </div>

        {/* Ensuring Layout Stability */}
        <div
          className="grid grid-cols-6 gap-x-2 gap-y-5 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-3 w-full mx-auto items-center justify-center text-center relative"
          style={{ minHeight: "150px" }} // Prevent layout shift
        >
          {categoriesLoading ? (
            <>
              {/* Skeleton Loaders for Placeholder */}
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="w-32 h-32 max-sm:w-24 max-sm:h-24 bg-gray-200 animate-pulse rounded-lg"
                ></div>
              ))}
            </>
          ) : (
            <>
              <ItemGrid
                items={categories}
                linkPath="/categories/brands"
                displayBig={true}
              />

              {/* RECYCLE Category */}
              <div className="flex justify-center">
                <Link
                  to={`/recycle-categories`}
                  className="w-32 p-4 h-32 max-sm:w-24 max-sm:h-24 flex bg-white cursor-pointer border border-secondary rounded-lg shadow-sm hover:shadow-xl transition ease-in-out duration-500"
                >
                  <img
                    src="/images/recycle1.png"
                    alt="Recycle"
                    className="w-full h-full object-contain"
                    width="128"
                    height="128" // Explicit height to prevent CLS
                  />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
