import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useGetServicesQuery } from "../../features/api";
import { FaAngleRight } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { BsFileArrowDown } from "react-icons/bs";
import { FaAnglesDown } from "react-icons/fa6";

const SubServices = () => {
  const { serviceCategoryId } = useParams();
  console.log("serviceCategoryId", serviceCategoryId);

  const { data: servicesData, isLoading: servicesDataLoading } =
    useGetServicesQuery();

  const [serviceCategory, setServiceCategory] = useState("");
  const [subServices, setSubServices] = useState("");
  console.log("serviceCategory", serviceCategory);
  console.log("subServices", subServices);

  const [subServiceSelected, setSubServiceSelected] = useState(false);
  const [selectedSubService, setSelectedSubService] = useState("");

  const [showSubService, setShowSubService] = useState(false);

  useEffect(() => {
    if (!servicesDataLoading) {
      const sc = servicesData.serviceCategories;
      console.log(sc, "sc");
      const serviceFound = sc.find((s) => s._id === serviceCategoryId);
      setServiceCategory(serviceFound);
      const subServiceFound = servicesData.serviceSubCategories.filter(
        (sc) => sc.serviceCategoryId._id === serviceCategoryId
      );
      setSubServices(subServiceFound);
    }
  }, [servicesData]);
  // console.log(object);

  return (
    <>
      <Helmet>
        <title>{`Avail ${serviceCategory?.name} Services | InstantCashPick`}</title>
        <meta
          name="description"
          content="Get instant cash payments with InstantCashPick. No more waiting for checks to clear or funds to transfer. Receive cash on the spot quickly and easily."
        />
        <meta
          name="keywords"
          content={`Sell
           on Instant Cash Pick, Instant Cash, Instant Pick, InstantCashPick, instant cash pick, instant cash, instant pick, sell mobiles on instantcashpick`}
        />
        <link rel="canonical" href={`https://instantcashpick.com/`} />
      </Helmet>
      <div className="mt-8 w-4/5 mx-auto">
        <div className="mx-0 mb-6">
          {
            <div className="flex items-center gap-1 max-sm:text-xs">
              <span className="flex items-center opacity-60 gap-1">
                <Link to={"/"}>Home</Link>
                <FaAngleRight />
                <Link to={`/services`}>Services</Link>
                <FaAngleRight />
                <span>{serviceCategory?.name}</span>
              </span>
              <FaAngleRight />
              <span>Sub Services</span>
            </div>
          }
          <hr className="text-black mt-1" />
        </div>

        {!subServices ? (
          // <h1 className="text-5xl text-black opacity-40 mx-auto">Loading...</h1>
          <div className="flex flex-col justify-center items-center h-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
            <span>Loading...</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="mt-2 mb-5">
              <div className="flex flex-col items-center justify-center cursor-pointer w-full h-full bg-white  sm:min-w-full rounded-0 sm:rounded-xl sm:ring-0 sm:ring-transparent sm:shadow sm:max-h-56 sm:max-w-44 hover:shadow-xl transition ease-in-out duration-500">
                <div className="flex horizontal w-28 h-28 items-start justify-between max-sm:w-24 max-sm:h-24">
                  <img
                    src={
                      import.meta.env.VITE_APP_BASE_URL + serviceCategory?.image
                    }
                    alt="CAT"
                    className="w-28 h-28 max-sm:w-32 max-sm:h-24"
                  />
                </div>
                <span className="text-center mt-2 flex-1 line-clamp-3 flex horizontal items-center justify-center h-9 sm:h-full sm:w-full sm:max-h-12">
                  <div className="text-[12px] font-[500] leading-7 max-sm:text-xs">
                    {serviceCategory?.name}
                  </div>
                </span>
              </div>
            </div>

            <div className="my-1">
              <h2 className="text-xl font-semibold">
                Select a Sub Service below
              </h2>
            </div>

            <div
              className={`${
                !subServiceSelected
                  ? `grid grid-cols-5 gap-6 max-md:grid-cols-4 max-sm:grid-cols-3`
                  : `flex flex-col`
              } `}
            >
              {subServices &&
                subServices.map((subService, i) => (
                  // <Link to={determinePath(serviceBrand)} key={i}>
                  <Link
                    key={i}
                    to={`/services/serviceSubProducts/${subService._id}`}
                    onClick={() => {
                      setSelectedSubService(subService._id);
                      setSubServiceSelected(!subServiceSelected);
                    }}
                  >
                    <div
                      key={i}
                      // className="w-28 p-4 cursor-pointer rounded-lg shadow-sm hover:shadow-xl transition ease-in-out duration-500"
                      className="flex flex-col items-center justify-center cursor-pointer w-full h-full bg-white  sm:min-w-full rounded-0 sm:rounded-xl sm:ring-0 sm:ring-transparent sm:shadow sm:max-h-56 sm:max-w-44 hover:shadow-xl transition ease-in-out duration-500"
                    >
                      <div className="flex horizontal w-28 h-28 items-start justify-between max-sm:w-24 max-sm:h-24">
                        <img
                          src={
                            import.meta.env.VITE_APP_BASE_URL + subService.image
                          }
                          alt="CAT"
                          className="w-28 h-28 max-sm:w-32 max-sm:h-24"
                        />
                      </div>
                      <span className="text-center mt-2 flex-1 line-clamp-3 flex horizontal items-center justify-center h-9 sm:h-full sm:w-full sm:max-h-12">
                        <div className="text-[12px] font-[500] leading-7 max-sm:text-xs">
                          {subService.name}
                        </div>
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
            {/* {subServiceSelected && (
              <div className="grid grid-cols-4 gap-4 mt-6 max-sm:grid-cols-3">
                {servicesData.serviceSubProduct
                  .filter((ssp) => ssp.subServiceId._id === selectedSubService)
                  .map((subProd, i) => (
                    <Link
                      to={`/services/book-service/${subProd._id}?st=ss`}
                      key={i}
                    >
                      <div
                        key={i}
                        // className="w-28 p-4 cursor-pointer rounded-lg shadow-sm hover:shadow-xl transition ease-in-out duration-500"
                        className="flex flex-col items-center justify-center cursor-pointer w-full h-full bg-white  sm:min-w-full rounded-0 sm:rounded-xl sm:ring-0 sm:ring-transparent sm:shadow sm:max-h-56 sm:max-w-44 hover:shadow-xl transition ease-in-out duration-500"
                      >
                        <div className="flex horizontal w-28 h-28 items-start justify-between max-sm:w-24 max-sm:h-24">
                          <img
                            src={
                              import.meta.env.VITE_APP_BASE_URL + subProd.image
                            }
                            alt="CAT"
                            className="w-28 h-28 max-sm:w-32 max-sm:h-24"
                          />
                        </div>
                        <span className="text-center mt-2 flex-1 line-clamp-3 flex flex-col  horizontal items-center justify-center h-9 sm:h-full sm:w-full sm:max-h-12">
                          <div className="text-[12px] font-[500] leading-7 max-sm:text-xs">
                            <span>{subProd.name}</span>
                          </div>
                          <div className="flex gap-5 justify-between items-start">
                            <span className="text-red-500 line-through">
                              ₹
                              {(subProd.discount * subProd.price) / 100 +
                                subProd.price}
                            </span>
                            <span className="text-red-500">
                              ₹{subProd.price}
                            </span>
                          </div>
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            )} */}
          </div>
        )}

        <div></div>
      </div>
    </>
  );
};

export default SubServices;
