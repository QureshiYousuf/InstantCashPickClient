import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import {
  useGetProductDetailsQuery,
  useGetVariantsQuestionsQuery,
  useUpdatePriceDropMutation,
} from "../../../features/api";

import { toast } from "react-toastify";

import UpdateSystemConfigurations from "./systemPriceDrops/UpdateSystemConfigurations";
import UpdateSystemConditions from "./systemPriceDrops/UpdateSystemConditions";
import BackButton from "../../components/BackButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchProcessorDeductions } from "../../features/processorSlice";

const ProductQuestionsList = () => {
  const { productId } = useParams();
  // Query Params
  const [searchParams] = useSearchParams();
  const selectedVariant = searchParams.get("variant");
  // console.log("selectedVariant", selectedVariant);

  const [selectedDeductions, setSelectedDeductions] = useState(null);

  const [productCategory, setProductCategory] = useState(null);
  const [processorsList, setProcessorsList] = useState(null);
  // const [selectedProcessorId, setSelectedProcessorId] = useState(null);
  const [selectedProcessorDeductions, setSelectedProcessorDeductions] =
    useState(null);
  // const [processorBasedDeductions, setProcessorBasedDeductions] =
  //   useState(null);

  const [selectedVariantToFill, setSelectedVariantToFill] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedMobileCat, setSelectedMobileCat] = useState(false);
  const [selectedSystemCat, setSelectedSystemCat] = useState(false);
  const [selectedOtherCat, setSelectedOtherCat] = useState(false);

  const [toggle, setToggle] = useState({
    updateAllSystemConfig: false,
    updateSingleSystemConfig: false,
    updateAllProcessorsProblems: false,
    updateSingleProcessorProblems: false,
    showSystemConfiguration: true,
  });

  const { data: productDetail, isLoading: productsLoading } =
    useGetProductDetailsQuery(productId);

  const [productData, setProductData] = useState(null);

  const [updatePriceDrop, { isLoading: updateLoading }] =
    useUpdatePriceDropMutation();

  const {
    data: variantsQuestionsData,
    isLoading: variantsQuestionsDataLoading,
  } = useGetVariantsQuestionsQuery();

  // console.log("selectedDeductions", selectedDeductions);

  const laptopDesktop = ["laptop", "desktop"];

  const fillVariantPriceDrops = async () => {
    console.log("fillVariantPriceDrops");
    const variantIndex = productData.variantDeductions.findIndex(
      (variant) => variant.variantName == selectedVariant
    );

    console.log("variantIndex", variantIndex);

    if (variantIndex === -1) {
      // Variant not found, return without updating
      return;
    }

    const updatedDeductions = productData.variantDeductions.map(
      (variant, index) => {
        if (index === variantIndex) {
          // Update the condition label with the provided conditionLabelId
          return {
            ...variant,
            deductions: selectedVariantToFill.deductions,
          };
        } else {
          // Return the variant without updating
          return variant;
        }
      }
    );

    // const updatedDeductions = productData.variantDeductions.map(
    //   (variant, index) => {
    //     if (index === variantIndex) {
    //       // Update the condition label with the provided conditionLabelId
    //       return {
    //         ...variant,
    //       };
    //     } else {
    //       // Return the variant without updating
    //       return variant;
    //     }
    //   }
    // );

    console.log("updatedDeductions", updatedDeductions);
    console.log("selectedVariantToFill", selectedVariantToFill);

    // Update the product data with the updated deductions
    const updatedProductData = {
      ...productData,
      variantDeductions: updatedDeductions,
    };

    // Set the updated product data
    setProductData(updatedProductData);
    setSelectedDeductions(updatedProductData.variantDeductions[variantIndex]);
    setIsOpen(false);
  };

  // Variant Deductions PriceDrops Update
  const handlePriceDropChange = (conditionLabelId, value, check) => {
    // Find the index of the variant in the deductions array
    // console.log("Variant Deductions");
    // console.log(productData);

    const variantIndex = productData.variantDeductions.findIndex(
      (variant) => variant.variantName == selectedVariant
    );

    if (variantIndex === -1) {
      // Variant not found, return without updating
      return;
    }

    let updatedDeductions;

    if (check === "priceDrop") {
      // Update the deductions for the selected variant
      // const updatedDeductions = productData.variantDeductions.map(
      updatedDeductions = productData.variantDeductions.map(
        (variant, index) => {
          if (index === variantIndex) {
            // Update the condition label with the provided conditionLabelId
            return {
              ...variant,
              deductions: variant.deductions.map((condition) => ({
                ...condition,
                conditionLabels: condition.conditionLabels.map((label) => ({
                  ...label,
                  priceDrop:
                    label.conditionLabelId === conditionLabelId
                      ? value
                      : label.priceDrop,
                })),
              })),
            };
          } else {
            // Return the variant without updating
            return variant;
          }
        }
      );
    } else if (check === "operation") {
      updatedDeductions = productData.variantDeductions.map(
        (variant, index) => {
          if (index === variantIndex) {
            // Update the condition label with the provided conditionLabelId
            return {
              ...variant,
              deductions: variant.deductions.map((condition) => ({
                ...condition,
                conditionLabels: condition.conditionLabels.map((label) => ({
                  ...label,
                  operation:
                    label.conditionLabelId === conditionLabelId
                      ? value
                      : label.operation,
                })),
              })),
            };
          } else {
            // Return the variant without updating
            return variant;
          }
        }
      );
    }

    // Update the product data with the updated deductions
    const updatedProductData = {
      ...productData,
      variantDeductions: updatedDeductions,
    };

    // Set the updated product data
    setProductData(updatedProductData);
    setSelectedDeductions(updatedProductData.variantDeductions[variantIndex]);
  };

  // Simple Deductions PriceDrops Update
  const handlePriceDropChange2 = (conditionLabelId, value, check) => {
    // Find the condition label by conditionLabelId and update the priceDrop
    // console.log("Simple Deductions", check);
    let updatedProductData;
    if (check === "priceDrop") {
      updatedProductData = {
        ...productData,
        simpleDeductions: productData.simpleDeductions.map((condition) => ({
          ...condition,
          conditionLabels: condition.conditionLabels.map((label) => ({
            ...label,
            priceDrop:
              label.conditionLabelId === conditionLabelId
                ? value
                : label.priceDrop,
          })),
        })),
      };

      // console.log("updatedProductData", updatedProductData);
    } else if (check === "operation") {
      // console.log("OPERATION", value);
      updatedProductData = {
        ...productData,
        simpleDeductions: productData.simpleDeductions.map((condition) => ({
          ...condition,
          conditionLabels: condition.conditionLabels.map((label) => ({
            ...label,
            operation:
              label.conditionLabelId === conditionLabelId
                ? value
                : label.operation,
          })),
        })),
      };
    }
    setProductData(updatedProductData);
    setSelectedDeductions(updatedProductData.simpleDeductions);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updatePriceDrop({
        productId: productId,
        data: productData,
      }).unwrap();
      toast.success("Updated PriceDrops for the Product");
      // Handle success
    } catch (error) {
      console.error("Error updating condition:", error);
    }
  };

  // THUNK SETUP
  const {
    results: processorThunk,
    loading,
    error,
  } = useSelector((state) => state.processor);
  // console.log("processorThunk", processorThunk);

  const dispatch = useDispatch();

  const handleProcessor = async (event) => {
    console.log("handle processor");

    const processorId = event.target.value;
    console.log("processorId", processorId);

    dispatch(fetchProcessorDeductions(processorId));
  };

  // const handleProcessor = async (event) => {
  //   console.log("handle processor");

  //   const processorId = event.target.value;
  //   console.log("processorId", processorId);

  //   setSelectedProcessorId(processorId);

  //   console.log("processorBasedDeductions", processorBasedDeductions);

  //   // const processor = processorBasedDeductions.find(
  //   //   (pbd) => pbd.processorId === processorId
  //   // );
  //   // setSelectedProcessorDeductions(processor);
  //   // console.log("selectedProcessorDeductions", selectedProcessorDeductions);

  //   async function getProcessorDeductions(processorId) {
  //     // let URL =
  //     //   import.meta.env.VITE_BUILD === "development"
  //     //     ? `http://localhost:8000/api/products/processor-deductions/${processorId}`
  //     //     : `https://api.instantpick.in/api/products/processor-deductions/${processorId}`;

  //     const URL = `${
  //       import.meta.env.VITE_APP_BASE_URL
  //     }/api/products/processor-deductions/${processorId}`;

  //     try {
  //       const response = await fetch(URL, {
  //         method: "GET", // HTTP method
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error(`Error: ${response.status} ${response.statusText}`);
  //       }

  //       const data = await response.json(); // Parse the JSON response
  //       // console.log("Processor Deductions:", data);
  //       return data;
  //     } catch (error) {
  //       console.error("Failed to fetch processor deductions:", error);
  //     }
  //   }

  //   const result = await getProcessorDeductions(processorId);
  //   setSelectedProcessorDeductions(result);
  //   console.log(
  //     "selectedProcessorDeductions",
  //     result,
  //     selectedProcessorDeductions
  //   );
  // };

  const toggleBtnStyle =
    "px-1 py-2 my-1 flex font-thin text-black bg-gray-200 border border-gray-600 transition-all duration-300";
  // "px-2 py-1 my-1 w-fit right-0 text-end flex justify-end items-end  border border-green-600 text-black rounded ";

  const toggleStyle =
    "bg-gray-800 border rounded text-white font-bold text-xl translate-y-5 mx-1";
  // const toggleStyle = "bg-red-600 text-white font-thin text-lg border-red-50";

  //  UseEffect to set the Deductions what is selected
  useEffect(() => {
    if (productDetail) {
      // console.log("productDetail", productDetail);

      let productCat = productDetail.category.name;
      setProductCategory(productCat);

      // Set the matched product to the component state
      setProductData(productDetail);
      if (productCat === "Mobile") {
        setSelectedMobileCat(true);
        setSelectedDeductions(
          productDetail.variantDeductions.find(
            (d) => d.variantName == selectedVariant
          )
        );
      } else if (laptopDesktop.includes(productCat.toLowerCase())) {
        setSelectedSystemCat(true);
        setSelectedDeductions(productDetail.simpleDeductions);
        // setProcessorBasedDeductions(productDetail.processorBasedDeduction);
        const processors = productDetail.simpleDeductions.find((d) =>
          d.conditionName.toLowerCase().includes("processor")
        );
        setProcessorsList(processors?.conditionLabels);
      } else {
        setSelectedOtherCat(true);
        setSelectedDeductions(productDetail.simpleDeductions);
      }
    }
  }, [productDetail]);

  useEffect(() => {
    console.log("thunk response in useEffect");
    if (Object.keys(processorThunk).length > 0) {
      setSelectedProcessorDeductions(processorThunk);
    }
  }, [processorThunk]);

  // console.log("processorsList", processorsList);

  return (
    <div className="relative">
      <BackButton location={"/admin/products-list"} />

      <div className=" w-[95%] flex flex-col mx-auto my-1 bg-white px-4 py-2 rounded shadow-xl">
        <div className=" flex justify-center m-2">
          <h3 className="absolute top-4 text-3xl font-serif font-bold">
            {productData ? productData.name : "Loading.."}{" "}
            {!selectedSystemCat && selectedVariant}
          </h3>
          {selectedSystemCat ? (
            <span className="text-4xl font-bold font-serif ">
              {productCategory} Problems & Configuration
            </span>
          ) : null}
          {/* VariantsQuestions List */}
          {productData && selectedMobileCat ? (
            <div className="flex items-center justify-around gap-4">
              {!variantsQuestionsDataLoading &&
                variantsQuestionsData.map((vq) => {
                  return (
                    <div key={vq.id}>
                      <button
                        onClick={() => {
                          setSelectedVariantToFill(vq);
                          setIsOpen(true);
                        }}
                        className={`bg-green-600 px-2 py-1 text-sm rounded text-white ${
                          vq.name === selectedVariantToFill?.name
                            ? `bg-red-600 text-xl`
                            : ``
                        }`}
                      >
                        {vq.name}
                      </button>
                    </div>
                  );
                })}
            </div>
          ) : null}
        </div>

        <div className="bg-scroll relative">
          {/* Mobile category pricedrops */}
          {productData && selectedMobileCat ? (
            <form onSubmit={handleSubmit}>
              {productData &&
                selectedDeductions.deductions.map((condition, index) => (
                  <div
                    key={condition.id}
                    className={`mb-10 border my-2 py- px- rounded ${
                      index % 2 === 0 ? `` : `bg-gray-100`
                    }`}
                  >
                    <div>
                      <h3 className="text-2xl text-center font-serif font-extrabold py-2 bg-white">
                        {condition.conditionName}
                      </h3>
                    </div>
                    <hr />
                    <div className="flex flex-col px-4 py-2">
                      {condition.conditionLabels &&
                        condition.conditionLabels.map(
                          (conditionLabel, index) => (
                            <div
                              key={conditionLabel.id}
                              className="flex gap-6 items-center mt-2"
                            >
                              <div>
                                <div>
                                  <h3 className="text-sm">
                                    {conditionLabel.conditionLabel}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-1">
                                  {productCategory !== "Mobile" ? (
                                    <span className="text-lg">₹</span>
                                  ) : null}
                                  <input
                                    type="number"
                                    name="priceDrop"
                                    value={conditionLabel.priceDrop}
                                    className="border px-3 py-1 rounded text-[0.9rem]"
                                    placeholder="Price Drop"
                                    // onChange={handleInputChange}
                                    onChange={(e) =>
                                      handlePriceDropChange(
                                        conditionLabel.conditionLabelId,
                                        parseInt(e.target.value),
                                        e.target.name
                                      )
                                    }
                                    required
                                  />
                                  {productCategory === "Mobile" ? (
                                    <span className="text-lg">%</span>
                                  ) : null}
                                </div>
                              </div>
                              <div>
                                <img
                                  src={
                                    import.meta.env.VITE_APP_BASE_URL +
                                    conditionLabel.conditionLabelImg
                                  }
                                  alt="conditionLabelImg"
                                  className="w-[60px] h-[60px] mx-auto "
                                />
                              </div>
                              <div className="flex gap-4">
                                <div className="w-[82px] text-center">
                                  <h3
                                    className={`${
                                      conditionLabel.operation === "Subtrack"
                                        ? "bg-red-200"
                                        : "bg-blue-200"
                                    } text-black font-bold px-2 py-1 rounded`}
                                  >
                                    {conditionLabel.operation}
                                  </h3>
                                </div>
                                <select
                                  name="operation"
                                  id=""
                                  className="border rounded px-1"
                                  onChange={(e) => {
                                    if (e.target.value !== "") {
                                      handlePriceDropChange(
                                        conditionLabel.conditionLabelId,
                                        e.target.value,
                                        e.target.name
                                      );
                                    }
                                  }}
                                >
                                  <option value="">Select Operation</option>
                                  <option value="Subtrack">Subtrack</option>
                                  <option value="Add">Add</option>
                                </select>
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  </div>
                ))}
              <div className="py-3 px-2">
                <button
                  type="submit"
                  className={`w-[20%] bg-green-600 text-white rounded-md p-1 cursor-pointer hover:bg-green-700 disabled:cursor-none disabled:bg-gray-300`}
                  disabled={updateLoading}
                >
                  {!updateLoading ? "Update Price Drops" : "Loading..."}
                </button>
              </div>
            </form>
          ) : null}

          {/* Laptop category pricedrops */}
          {productData && selectedSystemCat ? (
            <>
              {/* Buttons */}
              {/* <div className="flex flex-col items- justify-around"> */}

              <div className="flex flex-col">
                {/* Buttons Wrapper */}
                <div className="flex justify-center sticky top-0 bg-white z-10 border-b mb-12">
                  {/* Update Single Configuration */}
                  <div
                    className={`${toggleBtnStyle} ${
                      toggle.updateSingleSystemConfig
                        ? toggleStyle
                        : `border rounded-tl rounded-bl`
                    }`}
                  >
                    <button
                      onClick={() => {
                        setToggle({
                          updateAllSystemConfig: false,
                          updateSingleSystemConfig:
                            !toggle.updateSingleSystemConfig,
                          updateAllProcessorsProblems: false,
                          updateSingleProcessorProblems: false,
                          showSystemConfiguration: false,
                        });
                      }}
                    >
                      Update Single{" "}
                      <span className="font-bold">{productData.name}</span>{" "}
                      <span className="font-semibold">Configurations</span>
                    </button>
                  </div>

                  {/* Update All Configuration */}
                  <div
                    className={`${toggleBtnStyle} ${
                      toggle.updateAllSystemConfig ? toggleStyle : ``
                    }`}
                  >
                    <button
                      onClick={() => {
                        setToggle({
                          updateAllSystemConfig: !toggle.updateAllSystemConfig,
                          updateSingleSystemConfig: false,
                          updateAllProcessorsProblems: false,
                          updateSingleProcessorProblems: false,
                          showSystemConfiguration: false,
                        });
                      }}
                    >
                      Update All Configurations
                    </button>
                  </div>

                  {/* Show Config Details */}
                  <div
                    className={`px-2 ${toggleBtnStyle} ${
                      toggle.showSystemConfiguration ? toggleStyle : ""
                    }`}
                  >
                    <button
                      onClick={() => {
                        setToggle({
                          updateAllSystemConfig: false,
                          updateSingleSystemConfig: false,
                          updateAllProcessorsProblems: false,
                          updateSingleProcessorProblems: false,
                          showSystemConfiguration:
                            !toggle.showSystemConfiguration,
                        });
                      }}
                    >
                      Configurations
                      {/* Show {productCategory} Configuration */}
                    </button>
                  </div>

                  {/* Update Single Processor Problems */}
                  <div
                    className={`${toggleBtnStyle} ${
                      toggle.updateSingleProcessorProblems ? toggleStyle : ``
                    }`}
                  >
                    <button
                      onClick={() => {
                        setToggle({
                          updateAllSystemConfig: false,
                          updateSingleSystemConfig: false,
                          updateAllProcessorsProblems: false,
                          updateSingleProcessorProblems:
                            !toggle.updateSingleProcessorProblems,
                          showSystemConfiguration: false,
                        });
                      }}
                    >
                      Update Single Processor Problems
                    </button>
                  </div>

                  {/* Update All Processors Problems */}
                  <div
                    className={`${toggleBtnStyle} ${
                      toggle.updateAllProcessorsProblems
                        ? toggleStyle
                        : `border rounded-tr rounded-br`
                    }`}
                  >
                    <button
                      onClick={() => {
                        setToggle({
                          updateAllSystemConfig: false,
                          updateSingleSystemConfig: false,
                          updateAllProcessorsProblems:
                            !toggle.updateAllProcessorsProblems,
                          showSystemConfiguration: false,
                        });
                      }}
                    >
                      Update All Processors Problems
                    </button>
                  </div>
                </div>

                {/* Select Processor */}
                {processorsList &&
                (toggle.updateAllProcessorsProblems ||
                  toggle.updateSingleProcessorProblems) ? (
                  <div className="flex items-center gap-2 my-2">
                    <span>Processors List</span>
                    <select
                      name=""
                      className="border border-black rounded"
                      onChange={() => handleProcessor(event)}
                    >
                      <option value="">Select Processor</option>

                      {/* {productData.simpleDeductions
                      .find((sd) => sd.conditionName.includes("Processor"))
                      .conditionLabels.map((cl, i) => (
                        <option value={cl.conditionLabelId} key={i}>
                          {cl.conditionLabel}
                        </option>
                      ))} */}
                      {processorsList.map((processor, i) => (
                        <option value={processor.conditionLabelId} key={i}>
                          {processor.conditionLabel}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {/* Show Current Laptop Configuration */}
                {toggle.showSystemConfiguration &&
                  selectedDeductions.map((condition, index) => (
                    <div
                      key={condition.id}
                      className={`w-1/2 mx-auto mb-10 border my-2 py- px- rounded ${
                        index % 2 === 0 ? `` : `bg-gray-100`
                      }`}
                    >
                      <div>
                        <h3 className="text-2xl py-2 font-serif text-center font-extrabold bg-white">
                          {condition.conditionName}
                        </h3>
                      </div>
                      <hr />

                      <div className="flex px-4 py-2 flex-col ">
                        {condition.conditionLabels &&
                          condition.conditionLabels.map(
                            (conditionLabel, index) => (
                              <div
                                key={index}
                                className="flex justify-around items-center mt-2 border-b-2 pb-1"
                              >
                                <div>
                                  <h3 className="text-sm">
                                    {conditionLabel.conditionLabel}
                                  </h3>
                                </div>

                                <div className="flex items-center gap-1">
                                  {productCategory !== "Mobile" ? (
                                    <span className="text-lg">₹</span>
                                  ) : null}
                                  <span className="  px-3 py-1 mx-5 rounded text-[0.9rem]">
                                    {conditionLabel.priceDrop}
                                  </span>
                                </div>

                                <div className="w-[82px] text-center">
                                  <h3
                                    className={`${
                                      conditionLabel.operation === "Subtrack"
                                        ? "bg-red-200"
                                        : "bg-blue-200"
                                    } text-black font-bold px-2 py-1 rounded`}
                                  >
                                    {conditionLabel.operation}
                                  </h3>
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  ))}

                {toggle.updateAllSystemConfig && (
                  <UpdateSystemConfigurations
                    type={"AllLaptopConfig"}
                    productDetail={productDetail}
                    productId={productId}
                  />
                )}

                {toggle.updateSingleSystemConfig && (
                  <UpdateSystemConfigurations
                    type={"SingleLaptopConfig"}
                    productDetail={productDetail}
                    productId={productId}
                  />
                )}

                {toggle.updateAllProcessorsProblems && (
                  <UpdateSystemConditions
                    productData={productData}
                    selectedProcessorDeductions={selectedProcessorDeductions}
                    setSelectedProcessorDeductions={
                      setSelectedProcessorDeductions
                    }
                    // handleLaptopPriceDropChange={handleLaptopPriceDropChange}
                    setProductData={setProductData}
                    type={"AllLaptopConditions"}
                  />
                )}

                {toggle.updateSingleProcessorProblems && (
                  <UpdateSystemConditions
                    productData={productData}
                    selectedProcessorDeductions={selectedProcessorDeductions}
                    setSelectedProcessorDeductions={
                      setSelectedProcessorDeductions
                    }
                    // handleLaptopPriceDropChange={handleLaptopPriceDropChange}
                    setProductData={setProductData}
                    type={"SingleLaptopConditions"}
                  />
                )}
              </div>
            </>
          ) : null}

          {/* Deductions List Apart from Mobiles and Laptops */}
          {productData && selectedOtherCat ? (
            <>
              <h3 className="text-center text-xl">
                Deductions List Apart from Mobiles and Laptops
              </h3>
              <form onSubmit={handleSubmit}>
                {productData &&
                  selectedDeductions.map((condition, index) => (
                    <div
                      key={index}
                      className={`mb-10 border my-2 py- px- rounded ${
                        index % 2 === 0 ? `` : `bg-gray-100`
                      }`}
                    >
                      <div>
                        <h3 className="text-2xl py-2 font-serif text-center font-extrabold bg-white">
                          {condition.conditionName}
                        </h3>
                      </div>
                      <hr />
                      <div className="flex px-4 py-2 flex-col">
                        {condition.conditionLabels &&
                          condition.conditionLabels.map(
                            (conditionLabel, index) => (
                              <div
                                key={index}
                                className={`flex gap-6 items-center mt-2`}
                              >
                                <div>
                                  <div>
                                    <h3 className="text-sm">
                                      {conditionLabel.conditionLabel}
                                    </h3>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    {productCategory !== "Mobile" ? (
                                      <span className="text-lg">₹</span>
                                    ) : null}
                                    <input
                                      type="number"
                                      name="priceDrop"
                                      value={conditionLabel.priceDrop}
                                      className="border px-3 py-1 rounded text-[0.9rem]"
                                      placeholder="Price Drop"
                                      onChange={(e) =>
                                        handlePriceDropChange2(
                                          conditionLabel.conditionLabelId,
                                          parseInt(e.target.value),
                                          e.target.name
                                        )
                                      }
                                      required
                                    />
                                  </div>
                                </div>

                                {conditionLabel.conditionLabelImg && (
                                  <div>
                                    <img
                                      src={
                                        import.meta.env.VITE_APP_BASE_URL +
                                        conditionLabel.conditionLabelImg
                                      }
                                      alt="conditionLabelImg"
                                      className="w-[60px] h-[60px] mx-auto "
                                    />
                                  </div>
                                )}
                                <div className="flex gap-4">
                                  <div className="w-[82px] text-center">
                                    <h3
                                      className={`${
                                        conditionLabel.operation === "Subtrack"
                                          ? "bg-red-200"
                                          : "bg-blue-200"
                                      } text-black font-bold px-2 py-1 rounded`}
                                    >
                                      {conditionLabel.operation}
                                    </h3>
                                  </div>
                                  <select
                                    name="operation"
                                    id=""
                                    className="border rounded px-1"
                                    onChange={(e) => {
                                      if (e.target.value !== "") {
                                        handlePriceDropChange2(
                                          conditionLabel.conditionLabelId,
                                          e.target.value,
                                          e.target.name
                                        );
                                      }
                                    }}
                                  >
                                    <option value="">Select Operation</option>
                                    <option value="Subtrack">Subtrack</option>
                                    <option value="Add">Add</option>
                                  </select>
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  ))}
                <div className="py-3 px-2">
                  <button
                    type="submit"
                    className="w-[20%] bg-green-600 text-white rounded-md p-1 cursor-pointer hover:bg-green-700"
                  >
                    Update {productCategory} Deductions
                  </button>
                </div>
              </form>
            </>
          ) : null}
        </div>
      </div>

      {isOpen && (
        <div>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-fit">
              <div className="flex justify-center">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Sure want to Update this Variants Data?
                </h2>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex gap-4 items-center">
                  <span>Selected Variant</span>
                  <h3 className="text-2xl font-semibold">
                    {selectedVariantToFill?.name}
                  </h3>
                </div>
              </div>
              <div className="flex justify-around mt-8">
                <button
                  onClick={() => fillVariantPriceDrops()}
                  className="bg-green-600 text-white px-4 py-1 rounded"
                >
                  Yes
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedVariantToFill(null);
                  }}
                  className="bg-red-700 text-white px-4 py-1 rounded"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductQuestionsList;
