import React, { useState, useEffect, useRef } from "react";
import { useGetAllProductsQuery } from "../features/api";
import { Link } from "react-router-dom";
import "./searchStyle.css";
import { BsSearch } from "react-icons/bs";
import axios from "axios";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // const { data: productsData, isLoading: productsLoading } =
  //   useGetAllProductsQuery({
  //     search,
  //     page,
  //     limit: 10,
  //   });

  const [productsData, setProductsData] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  console.log("productsData", productsData);

  console.log(
    "import.meta.env.VITE_APP_BASE_URL",
    import.meta.env.VITE_BUILD === "development"
  );

  const handleSearch = async () => {
    // setSearched(true);
    // setPage(1);
    try {
      setProductsLoading(true);

      let response;
      if (import.meta.env.VITE_BUILD === "development") {
        response = await axios.get("http://localhost:8000/api/products", {
          params: {
            search: search.trim() ? search : undefined,
            page,
            limit: 10,
          },
        });
      } else if (import.meta.env.VITE_BUILD === "production") {
        response = await axios.get(
          "https://api.yusufqureshi.online/api/products",
          {
            params: {
              search: search.trim() ? search : undefined,
              page,
              limit: 10,
            },
          }
        );
      }

      // const response = await axios.get("/api/products", {
      //   params: {
      //     search: search.trim() ? search : undefined,
      //     page,
      //     limit: 10,
      //   },
      // });
      console.log("response", response);
      setProductsData(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  const productListRef = useRef(null);

  useEffect(() => {
    setPage(1); // Reset page number on new search
  }, [search]);

  useEffect(() => {
    if (!productsLoading && productsData) {
      setHasMore(productsData.totalPages > page);
    }
  }, [productsLoading, productsData, page]);

  const handleScroll = () => {
    if (
      productListRef.current.scrollTop === 0 &&
      page > 1 &&
      !productsLoading
    ) {
      setPage((prevPage) => prevPage - 1); // Decrement page number for previous page
      handleSearch();
    } else if (
      productListRef.current.scrollHeight - productListRef.current.scrollTop ===
        productListRef.current.clientHeight &&
      hasMore &&
      !productsLoading
    ) {
      setPage((prevPage) => prevPage + 1); // Increment page number for next page
      handleSearch();
    }
  };

  // Function to clear the search
  const clearSearch = () => {
    // console.log("clear search");
    setSearch("");
  };

  useEffect(() => {
    // Add event listener to document for click events
    document.addEventListener("click", clearSearch);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("click", clearSearch);
    };
  }, []); // Empty dependency array to run effect only once on mount

  return (
    <div className="bg-white grow border rounded mx-4 md:w-80 sm:w-64 max-2sm:w-[58%] max-2sm:mx-2">
    {/* <div className="bg-white grow border rounded mx-4 md:w-80 sm:w-64 2sm:w-3/4 3sm:mx-1 3sm:w-[100px]"> */}
      <div className="flex pl- items-center bg-gray-100 pl-2">
        <BsSearch className="text-gray-500" />
        <input
          type="search"
          name="search"
          value={search}
          id="search"
          // className="text-black grow pl-2 pr-5 py-2 w-full rounded-full md:w-72 sm:w-64 2sm:w-3/4 3sm:w-3/4 focus:bg-transparent outline-none"
          className="text-black grow bg-gray-100 px-2 text-sm py-2 focus:bg-transparent outline-none"
          placeholder={`Search for Mobiles, Laptops etc.. `}
          onChange={(e) => {
            setSearch(e.target.value);
            handleSearch();
          }}
        />
      </div>

      {search && !productsLoading && productsData && (
        <div
          className="absolute bg-white text-black flex flex-col p-4 rounded max-h-[150px] overflow-y-auto scrollbar md:w-72 sm:w-64 2sm:w-3/4 3sm:w-3/4"
          // style={{ maxHeight: "200px", overflowY: "scroll" }}
          ref={productListRef}
          onScroll={handleScroll}
        >
          {!productsLoading &&
            productsData.products.map((product, index) => (
              <div key={index} onClick={clearSearch}>
                <Link
                  to={`/categories/brands/productDetails/${product.id}`}
                  // onClick={clearSearch}
                >
                  <button className="py-1 border-b">
                    <h2 className="">{product.name}</h2>
                  </button>
                </Link>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
