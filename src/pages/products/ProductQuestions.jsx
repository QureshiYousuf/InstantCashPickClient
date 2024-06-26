import React, { useEffect, useRef, useState } from "react";
import {
  useGetProductDetailsQuery,
  useGenerateOTPMutation,
} from "../../features/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addDeductions,
  setGetUpto,
  clearDeductions,
  removeDeductions,
  addProductAge,
} from "../../features/deductionSlice";
import { clearLaptopDeductions } from "../../features/laptopDeductionSlice";
import { toast } from "react-toastify";
import ProdDeductionsRight from "./ProdQuestionsRight";
import LaptopsQuestions from "./LaptopsQuestions";
import OtpGenerator from "../otp/OTPGenerator";
import DeductionItems from "./DeductionItems";
import { Helmet } from "react-helmet-async";

const ProductDeductions = () => {
  // Query Params
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const selectedVariant = searchParams.get("variant");

  //   Fetching Product details
  const { data: productsData, isLoading } =
    useGetProductDetailsQuery(productId);
  const [priceGetUpTo, setPriceGetUpTo] = useState();
  const [deductions, setDeductions] = useState();
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [currentConditionIndex, setCurrentConditionIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const [checkIsOn, setCheckIsOn] = useState(false);
  const [checkIsOff, setCheckIsOff] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const [age, setAge] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deductionData = useSelector((state) => state.deductions.deductions);
  const data = useSelector((state) => state.deductions);
  // console.log("useSelector", data);

  if (productsData) {
    // console.log("productsData ProductQuestions ", productsData);
  }

  const handleAge = async (ageLabel, price, operation) => {
    setAge(true);
    dispatch(
      addProductAge({
        conditionLabel: ageLabel,
        priceDrop: price,
        operation: operation,
      })
    );
  };

  const handleLabelSelection = (label, price, operation) => {
    console.log("handleLabelSelection");
    if (!selectedLabels.some((sl) => sl.conditionLabel == label)) {
      setSelectedLabels([
        ...selectedLabels,
        { conditionLabel: label, priceDrop: price },
      ]);
      dispatch(
        addDeductions({ conditionLabel: label, priceDrop: price, operation })
      );
      // console.log("selectedLabels", selectedLabels);
    } else if (selectedLabels.some((sl) => sl.conditionLabel == label)) {
      setSelectedLabels(
        selectedLabels.filter(
          (selectedLabel) => selectedLabel.conditionLabel !== label
        )
      );
      dispatch(
        removeDeductions({ conditionLabel: label, priceDrop: price, operation })
      );
    }
  };

  // handle continue to next condition and its conditionLabellist
  // const handleContinue = async () => {
  //   // Logic to handle continue to the next condition
  //   if (currentConditionIndex < deductions.length - 1) {
  //     setCurrentConditionIndex(currentConditionIndex + 1);
  //   } else {
  //     // Handle if there are no more conditions
  //     // dispatch(addDeductions(data.productAge));
  //     console.log("No more conditions to display.");
  //     setShowOTP(true);
  //     // navigate(`/sell/deductions/finalPrice?productId=${productsData.id}`);
  //     // navigate(`/sell/deductions/generateOTP?productId=${productsData.id}`);
  //   }
  // };

  const handleContinue = () => {
    if (currentPageIndex < sortedConditions.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      console.log("No more conditions to display.");
      setShowOTP(true);
    }
  };

  // if no deduction questions found
  if (productsData) {
    if (productsData.category.name === "Mobile") {
      if (productsData.variantDeductions.length < 1) {
        return (
          <h1 className="my-[10%] mx-auto text-center">
            No Questions Available Yet for Category{" "}
            <span className="font-bold"> {productsData.category.name}</span>
          </h1>
        );
      }
    } else if (productsData.category.name !== "Mobile") {
      if (productsData.simpleDeductions.length < 1) {
        return (
          <h1 className="my-[10%] mx-auto text-center">
            No Questions Available Yet for Category{" "}
            <span className="font-bold"> {productsData.category.name}</span>
          </h1>
        );
      }
    }
  }

  const closeModal = () => {
    setShowOTP(false);
  };

  // UseEffect to clear Deductions on initial render from reducer
  useEffect(() => {
    // Dispatch the action to clear deductions on initial render
    dispatch(clearDeductions());
    dispatch(clearLaptopDeductions());

    // Event listener to handle browser back button
    const handlePopstate = () => {
      // Dispatch the action to clear deductions when the user navigates back using the browser back button
      dispatch(clearDeductions());
      dispatch(clearLaptopDeductions());
    };

    // Add event listener for the popstate event
    window.addEventListener("popstate", handlePopstate);

    // Cleanup function to remove event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [dispatch]); // include dispatch in the dependency array to ensure that it has access to the latest dispatch function.

  // useEffect to set deductions and priceUpTo value from productsData
  useEffect(() => {
    if (productsData) {
      const variant = productsData.variants.filter(
        (variant) => variant.name == selectedVariant
      );
      setPriceGetUpTo(variant[0].price);
      // setDeductions(productsData.deductions);
      if (productsData.category.name === "Mobile") {
        const d = productsData.variantDeductions.filter(
          (vd) => vd.variantName === selectedVariant
        );
        console.log("Mobile Deductions", d[0].deductions);
        setDeductions(d[0].deductions);
      } else if (productsData.category.name !== "Mobile") {
        setDeductions(productsData.simpleDeductions);
      }
    }
    // console.log("selectedVariant", selectedVariant, priceGetUpTo);
  }, [productsData]);

  // useEffect to set initial State(productName,productCategory,productImage,variantName,price) in reducer
  useEffect(() => {
    let prodVariant = undefined;
    if (productsData) {
      prodVariant = {
        productCategory: productsData.category.name,
        productName: productsData.name,
        productImage: productsData.image,
        variantName: selectedVariant,
        price: priceGetUpTo,
      };
      dispatch(setGetUpto(prodVariant));
    }
  }, [priceGetUpTo]);

  // console.log("priceGetUpTo", priceGetUpTo);
  // console.log("Deductions", deductions);

  const groupConditionsByPage = (conditions) => {
    console.log("IN groupConditionsByPage", conditions);
    const grouped = conditions.reduce((acc, condition) => {
      const { page } = condition;
      if (!acc[page]) {
        acc[page] = [];
      }
      acc[page].push(condition);
      return acc;
    }, {});

    console.log("grouped", grouped);
    // Convert the grouped object into an array of pages with conditions
    const sortedPages = Object.keys(grouped)
      .sort((a, b) => a - b)
      .map((page) => ({
        page,
        conditions: grouped[page],
      }));

    console.log("sortedPages", sortedPages);

    return sortedPages;
  };

  // Usage
  // const sortedConditions = groupConditionsByPage(deductions);
  let sortedConditions;
  if (deductions && productsData.category.name === "Mobile") {
    sortedConditions = groupConditionsByPage(deductions);
  }

  // console.log("deductions", deductions);
  console.log("sortedConditions", sortedConditions);

  return (
    <>
      <Helmet>
        <title>{`Sell Old ${
          productsData ? `${productsData.category.name}` : null
        } Online and Get Instant Cash for used ${
          productsData ? `${productsData.category.name}s` : null
        } | InstantCashPick`}</title>

        <meta
          name="description"
          content="Get instant cash payments with InstantCashPick. No more waiting for checks to clear or funds to transfer. Receive cash on the spot quickly and easily."
        />

        <meta
          name="keywords"
          content="Instant Cash Pick, Instant Cash, Instant Pick, InstantCashPick, instant cash pick, instant cash, instant pick, instantcashpick"
        />
        <link rel="canonical" href="https://instantcashpick.com/" />
      </Helmet>
      <div className=" mt-4 ">
        {/* {showOTP ? ( */}
        <div className="flex gap-3 justify-center my-auto max-sm:flex-col max-sm:items-center">
          <div className="w-[55%] flex flex-col border py-6 rounded my-auto max-sm:w-[90%] ">
            {!checkIsOff && (
              <div className="mx-auto pb-10">
                <h1 className="">Tell Us More About Your Device</h1>
              </div>
            )}

            {/* Is mobile Switched On YES or NO */}
            {!checkIsOn && !checkIsOff && (
              <div className="px-5 py-2">
                <h1 className="justify-center text-center pb-4">
                  Is your {productsData && productsData.category.name} Switched
                  On?
                </h1>

                <div className="flex gap-4 justify-center">
                  <div
                    onClick={() => setCheckIsOn(true)}
                    className={`flex pr-16 items-center border rounded-md cursor-pointer p-2.5 ring-0 ring-transparent shadow hover:border-cyan-500`}
                  >
                    <span className="border border-solid rounded-full w-5 h-5 mr-1.5"></span>
                    <span className="text-sm  flex-1 flex justify-center">
                      Yes
                    </span>
                  </div>
                  <div
                    onClick={() => setCheckIsOff(true)}
                    className={`flex pr-16 items-center border rounded-md cursor-pointer p-2.5 ring-0 ring-transparent shadow hover:border-cyan-500`}
                  >
                    <span className="border px- border-solid border-surface-dark rounded-full w-5 h-5 mr-1.5"></span>
                    <span className="text-sm  flex-1 flex justify-center">
                      No
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* If the product if switched off */}
            {checkIsOff && (
              <div className="my-10 text-center">
                <div className="flex flex-col items-center">
                  <h1 className="my-3">
                    Your {productsData.category.name}
                    <span className="font-semibold"> {productsData.name} </span>
                    is{" "}
                    <span className="text-red-500 font-semibold">
                      Switched Off.
                    </span>
                  </h1>
                  <span className="text-lg px-4 text-[#E27D60]">
                    Please Contact Customer Support 8722288017
                  </span>
                </div>
              </div>
            )}

            {/* If products data is loading */}
            {isLoading && (
              <div className="flex flex-col justify-center items-center h-32">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
                <span>Loading...</span>
              </div>
            )}

            {/* Products that are not under Laptop Category */}
            {/* All conditions Except AGE */}
            {checkIsOn &&
            productsData &&
            deductions &&
            productsData.category.name.toLowerCase() !== "laptop" ? (
              <div key={sortedConditions[currentPageIndex].page}>
                {sortedConditions[currentPageIndex].conditions.map(
                  (condition) =>
                    !condition.conditionName.includes("Age") ? (
                      <div
                        className="flex flex-col"
                        key={condition.conditionId}
                      >
                        <div className="px-5 py-2 text-center font-extrabold text-lg">
                          <h1>{condition.conditionName}</h1>
                        </div>

                        <DeductionItems
                          conditionName={condition.conditionName}
                          conditionLabels={condition.conditionLabels}
                          handleLabelSelection={handleLabelSelection}
                        />

                        {/* <button
                        onClick={handleContinue}
                        className="px-2 py-1 bg-cyan-500 text-white border mx-auto rounded w-[35%] mt-6 hover:bg-white hover:border-cyan-500 hover:text-cyan-500"
                      >
                        Continue
                      </button> */}
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="px-5 py-2 text-center font-extrabold text-lg">
                          <h1>{condition.conditionName}</h1>
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-center px-4 max-sm:grid-cols-1 max-sm:gap-2">
                          {condition.conditionLabels.map((label) => (
                            <div
                              className={`${
                                //   selectedLabels.includes(label.conditionLabel)
                                data.productAge.conditionLabel ===
                                label.conditionLabel
                                  ? "border-cyan-500"
                                  : "bg-gray-100"
                              } flex pl-3 border rounded items-center`}
                              onClick={() =>
                                handleAge(
                                  label.conditionLabel,
                                  label.priceDrop,
                                  label.operation
                                )
                              }
                            >
                              <div className="flex text-sm items-center gap-1 py-4">
                                <span
                                  className={`${
                                    //   selectedLabels.includes(label.conditionLabel)
                                    data.productAge.conditionLabel ===
                                    label.conditionLabel
                                      ? "border-cyan-500"
                                      : "border-surface-dark"
                                  } border border-solid rounded-full w-5 h-5 mr-1.5`}
                                ></span>
                                <span className="text-sm flex-1 flex justify-center">
                                  {label.conditionLabel}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {age ? (
                          <button
                            onClick={handleContinue}
                            className="px-2 py-1 bg-cyan-500 text-white border mx-auto  rounded w-[35%] mt-6 hover:bg-white hover:border-cyan-500 hover:text-cyan-500"
                          >
                            Continue
                          </button>
                        ) : (
                          <button
                            className="px-2 py-1 border rounded w-[35%] m-2 bg-gray-400 mx-auto opacity-35 mt-6"
                            disabled
                          >
                            Select Age To Continue
                          </button>
                        )}
                      </div>
                    )
                )}
                {!sortedConditions[
                  currentPageIndex
                ].conditions[0].conditionName.includes("Age") && (
                  <div className="flex items-center">
                    <button
                      onClick={handleContinue}
                      className="px-2 py-1 bg-cyan-500 text-white border mx-auto rounded w-[35%] mt-6 hover:bg-white hover:border-cyan-500 hover:text-cyan-500"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            ) : (
              checkIsOn &&
              productsData &&
              deductions && (
                <LaptopsQuestions
                  productsData={productsData}
                  deductions={deductions}
                  handleContinue={handleContinue}
                  handleLabelSelection={handleLabelSelection}
                  rtkData={data}
                />
              )
            )}
          </div>

          {/* Right Side Div */}
          <ProdDeductionsRight />
        </div>
        {/* ) : null} */}

        {showOTP ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <OtpGenerator closeModal={closeModal} />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ProductDeductions;
