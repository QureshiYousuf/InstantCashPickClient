import React, { useState, useEffect } from "react";
import {
  useCreateRecycleOrderMutation,
  useGetProductDetailsQuery,
} from "../../features/api";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setGetUpto } from "../../features/deductionSlice";
import { FaAngleRight, FaIndianRupeeSign } from "react-icons/fa6";
import { Helmet } from "react-helmet-async";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { FaGooglePay } from "react-icons/fa";
import FormInput from "../../components/FormInput";
import Loading from "../../components/Loading";
import RecycleContent from "./RecycleContent";

const RecycleProductDetail = () => {
  const { prodId } = useParams();
  const { data: productDetails, isLoading } = useGetProductDetailsQuery(prodId);
  const [createRecycleOrder, { isLoading: orderLoading }] =
    useCreateRecycleOrderMutation();
  //   const [toggle, setToggle] = useState(true);
  const [variantSelected, setVariantSelected] = useState([]);
  //   const [isSelected, setIsSelected] = useState(false);
  const [selectedDiv, setSelectedDiv] = useState();

  const [isOpen, setIsOpen] = useState(false);

  const [checkMobileOn, setCheckMobileOn] = useState(false);
  const [mobileStatus, setMobileStatus] = useState("");

  const [checkLaptopOn, setCheckLaptopOn] = useState(false);
  const [laptopStatus, setLaptopStatus] = useState("");
  const [checkLaptopAge, setCheckLaptopAge] = useState(false);
  const [ageSelected, setAgeSelected] = useState("");
  const [laptopAge, setLaptopAge] = useState([
    "Between 1 - 3 Years",
    "More Than 3 Years",
  ]);

  const [recyclePrice, setRecyclePrice] = useState(500);
  // console.log("recyclePrice", recyclePrice);

  const [orderOpen, setOrderOpen] = useState(false);
  const [formData, setFormData] = useState();
  const [addressDetails, setAddressDetails] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const currentDate = new Date();
  const navigate = useNavigate();

  const [schedulePickUp, setSchedulePickUp] = useState(null);
  const [paymentMode, setPaymentMode] = useState("");
  const [showDigitalPay, setShowDigitalPay] = useState(false);

  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const [selectedDigitalPayment, setSelectedDigitalPayment] = useState("");
  // console.log(
  //   "selectedPaymentMode",
  //   selectedPaymentMode,
  //   "selectedDigitalPayment",
  //   selectedDigitalPayment
  // );

  const handlePaymentModeChange = (e) => {
    console.log("handlePaymentModeChange");
    setSelectedPaymentMode(e.target.value);
    setSelectedDigitalPayment(""); // Reset digital payment selection
  };

  const handleDigitalPaymentChange = (e) => {
    setSelectedDigitalPayment(e.target.value);
  };

  // Set the minimum time to 10:00 AM
  const minTime = new Date();
  minTime.setHours(10, 0, 0, 0);

  // Set the maximum time to 10:00 PM
  const maxTime = new Date();
  maxTime.setHours(22, 0, 0, 0);

  const handleToggle = (variantSelected) => {
    // setToggle((prevState) => !prevState);
    setVariantSelected(variantSelected);
    // setIsSelected(!isSelected);
    setSelectedDiv(variantSelected.id);
  };

  // console.log("variantSelected", variantSelected);
  // console.log("productDetails", productDetails);

  const handlePinCodeChange = (e) => {
    let value = e.target.value;

    // Remove non-numeric characters
    value = value.replace(/\D/g, "");

    // Restrict the length to 10 digits
    if (value.length <= 6) {
      setAddressDetails({ ...addressDetails, pinCode: Number(e.target.value) });
    } else {
      toast.error("PinCode cannot be more than 6 digits");
      return;
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;

    // Remove non-numeric characters
    value = value.replace(/\D/g, "");

    // Restrict the length to 10 digits
    if (value.length > 10) {
      toast.error("Phone Number cannot be more than 10 digits");
    }
    // if (value.length <= 10) {
    //   setFormData({ ...formData, phone: Number(e.target.value) });
    // } else {
    //   toast.error("Phone Number cannot be more than 10 digits");
    // }
  };

  const handleTimeChange = (date) => {
    setSelectedDate(date);

    const formattedDate = `${date.toLocaleString("en-US", {
      month: "long",
    })} ${date.getDate()}, ${date.getFullYear()} ${date.toLocaleTimeString(
      "en-US",
      { hour: "numeric", minute: "numeric", hour12: true }
    )}`;
    // console.log("formattedDate", formattedDate);
    setSchedulePickUp(formattedDate);
  };

  function handleLaptopSwitchOn() {
    // setRecyclePrice(700);
    setLaptopStatus("Switched On");
    setCheckLaptopOn(false);
    setCheckLaptopAge(true);
  }

  function handleLaptopSwitchOff() {
    setRecyclePrice(500);
    setLaptopStatus("Switched Off");
    setCheckLaptopOn(false);
    setIsOpen(true);
    // setCheckLaptopAge(true);
  }

  function handleMobileSwitchOn() {
    setRecyclePrice(700);
    setMobileStatus("Switched On");
    setCheckMobileOn(false);
    setIsOpen(true);
  }

  function handleMobileSwitchOff() {
    setRecyclePrice(500);
    setMobileStatus("Switched Off");
    setCheckMobileOn(false);
    setIsOpen(true);
  }

  function handleLaptopAge1() {
    setRecyclePrice(1500);
    setAgeSelected("Between 1-3 Years");
    setCheckLaptopAge(false);
    setIsOpen(true);
  }

  function handleLaptopAge2() {
    setRecyclePrice(500);
    // setAgeSelected(laptopAge[1]);
    setAgeSelected("More Than 3 Years");
    setCheckLaptopAge(false);
    setIsOpen(true);
  }

  // useEffect to select product variant
  useEffect(() => {
    if (!isLoading) {
      if (productDetails.category.name !== "Mobile") {
        handleToggle(productDetails.variants[0]);
      }
    }
    // setLoadedInitially(true);
  }, [productDetails]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit");

    if (
      selectedPaymentMode === "" ||
      (selectedPaymentMode.toLowerCase().includes("digital") &&
        selectedDigitalPayment === "")
    ) {
      toast.error("Select Payment Mode..!");
      return;
    }

    const data = new FormData(e.target);
    const formData = Object.fromEntries(data.entries());
    console.log("formData", formData);

    for (const i in formData) {
      // console.log(`${i}: ${formData[i]}`);
      if (formData[i] === "") {
        toast.error("Fill all the fields..!!");
        return;
      }
    }

    const orderData = {
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      schedulePickUp,
      addressDetails: {
        address: formData.address,
        state: formData.state,
        city: formData.city,
        pinCode: formData.pinCode,
      },
      productDetails: {
        productName: productDetails.name,
        productBrand: productDetails.brand.name,
        productCategory: productDetails.category.name,
        productVariant: productDetails.category.name
          .toLowerCase()
          .includes("mobile")
          ? variantSelected.name
          : null,
        productAge: productDetails.category.name
          .toLowerCase()
          .includes("laptop")
          ? ageSelected
          : null,
        productStatus: productDetails.category.name
          .toLowerCase()
          .includes("mobile")
          ? mobileStatus
          : laptopStatus,
      },
      paymentMode: selectedPaymentMode.toLowerCase().includes("instant")
        ? selectedPaymentMode
        : selectedDigitalPayment,
      recyclePrice,
      status: {
        pending: true,
        completed: false,
        cancelled: false,
      },
    };
    // console.log("orderData", orderData);

    try {
      const order = await createRecycleOrder(orderData);
      console.log("order", order);
      if (order.data.success) {
        //   closeModal();
        //   setOrderOpen(false);
        toast.success("Your Order placed successfully");
        navigate(`/recycle-categories`);
      }
    } catch (error) {
      console.log("Error while booking recycle product:- ", error.message);
    }
  };

  // console.log("formData", formData);
  // console.log("addressDetails", addressDetails);

  return (
    <>
      <Helmet>
        <title>{`Sell Old ${
          productDetails
            ? `${productDetails.name} ${productDetails.category.name}`
            : null
        }| InstantHub`}</title>

        <meta
          name="description"
          content="Get instant cash payments with InstantHub on selling your old, unused gadgets with us. Get instant cash at your doorstep. Visit the website to know more!"
        />

        <meta
          name="keywords"
          content="sell old mobiles online, sell old mobile online, sell old laptops online, sell old laptop online,sell old products on Instant Hub, Instant Cash, Instant Pick, InstantHub, instant hub, instant hub, instant pick, instanthub"
        />
        <link
          rel="canonical"
          href={`https://www.instanthub.in/recycle-categories/recycle-brands/recycle-productDetails/${prodId}`}
        />
      </Helmet>
      {/* <div className="w-[80%] mx-auto my-5 max-md:w-[90%] max-sm:my-5 bg-[url('/images/recycle1.png')] bg-center bg-no-repeat"> */}
      <div className="w-[80%] mx-auto my-5 max-md:w-[90%] max-sm:my-5 ">
        <p className="pb-5 text-2xl font-bold max-sm:text-sm max-sm:font-semibold">
          <span>Sell your </span>
          <span>
            {productDetails
              ? `${productDetails?.brand?.name} ${productDetails?.name} ${productDetails?.category?.name} `
              : null}
          </span>
          <span>to recycle and get Instant Cash</span>
        </p>
        {/* Header Links: Home > Category > Brand > Products > ProductName */}
        <div className="mx-0 mb-6">
          {productDetails && (
            <div className="flex items-center gap-1">
              <h2 className="flex items-center opacity-60 gap-1 max-2sm:text-xs max-sm:text-sm max-2sm:gap-0">
                <Link to={"/"} className="max-2sm:hidden">
                  Home
                </Link>
                <FaAngleRight className="max-2sm:hidden" />
                <Link to={"/recycle-categories"} className="max-2sm:hidden">
                  Recycle
                </Link>
                <Link to={"/recycle-categories"} className="2sm:hidden">
                  Re..
                </Link>
                <FaAngleRight />
                <Link
                  to={`/recycle-categories/recycle-brands/${productDetails.category.id}`}
                  className="max-2sm:hidden"
                >
                  Recycle {productDetails.category.name}
                </Link>
                <Link
                  to={`/recycle-categories/recycle-brands/${productDetails.category.id}`}
                  className="2sm:hidden"
                >
                  Recycle..
                </Link>
                <FaAngleRight />
                <Link
                  to={`/recycle-categories/recycle-brands/recycle-products/${productDetails.brand.id}`}
                  className="max-2sm:hidden"
                >
                  Recycle {productDetails.brand.name}{" "}
                  {productDetails.category.name}
                </Link>
                <Link
                  to={`/recycle-categories/recycle-brands/recycle-products/${productDetails.brand.id}`}
                  className="2sm:hidden"
                >
                  Recycle {productDetails.brand.name}..
                </Link>
                <FaAngleRight />
                {productDetails.name.length < 20 ? (
                  <span className={`font-semibold`}>{productDetails.name}</span>
                ) : (
                  <span className={`font-semibold`}>
                    {productDetails.name.substring(0, 14)}..
                  </span>
                )}
              </h2>
            </div>
          )}
          <hr className="text-black mt-1" />
        </div>

        <div className="">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <div className="bg-white flex flex-col sm:flex-row px-3 sm:p-6 max-sm:pb-3 max-sm:flex-col bg-[url('/images/recycle1.png')] bg-center bg-no-repeat">
                {/* IMAGE */}
                <div className="sm:flex items-center justify-center mr-5 w-full sm:max-w-xs max-sm:size-32 sm:w-1/3 h-20 sm:h-96 max-sm:mx-auto">
                  <div className="flex items-center justify-center h-full w-full">
                    <img
                      src={
                        import.meta.env.VITE_APP_BASE_URL + productDetails.image
                      }
                      alt="CAT"
                      className="size-48 max-sm:size-32"
                    />{" "}
                  </div>
                </div>

                {/* Products Details */}
                <div
                  className={`flex flex-col  w-full sm:w-2/3 max-sm:gap-6 max-14inch:gap-12 ${
                    productDetails.category.name === "Mobile"
                      ? `gap-16`
                      : `gap-10`
                  }`}
                >
                  <div className="mt-6 flex gap-2 items-center">
                    <h1 className="text-3xl">{productDetails.name}</h1>
                    {productDetails.category.name === "Mobile" &&
                      variantSelected.length != 0 && (
                        <h3 className="text-2xl">({variantSelected.name})</h3>
                      )}
                  </div>
                  {/* Check if it is Mobile Product */}
                  <div className="">
                    {productDetails.category.name
                      .toLowerCase()
                      .includes("mobile") ? (
                      <div className="flex flex-col gap-2">
                        <div className="">
                          <div className="text-xl max-sm:text-sm">
                            Recyle price will range between 500 - 700 <br />{" "}
                            based on the product status
                          </div>
                        </div>
                        <div>
                          <p>Choose a Variant</p>
                          <p className="opacity-40 text-sm">
                            Select a variant and click on Recycle to know the
                            recyle price
                          </p>
                        </div>

                        {/* VARIANT PRICE WILL BE SHOWN WHEN CLICKED ON A VARIANT */}
                        <div className="">
                          <div className="flex items-center">
                            {/* {variantSelected.price ? (
                              <FaIndianRupeeSign className="text-4xl" />
                            ) : null}
                            <h2 className="text-5xl text-yellow-500 bg-white pr-2 rounded-tr-xl rounded-br-xl">
                              {variantSelected.price}
                            </h2> */}
                          </div>
                        </div>
                        {/* END OF VARIANT PRICE */}

                        <div className="flex flex-row flex-wrap list-none p-0 my-0 -mx-2">
                          {productDetails.variants.map((variantSelected) => (
                            <div
                              key={variantSelected.id}
                              className="p-2 w-1/2 sm:w-40 sm:max-w-full"
                              onClick={() => handleToggle(variantSelected)}
                            >
                              <div
                                className={`${
                                  selectedDiv == variantSelected.id
                                    ? "bg-amber-500 text-white"
                                    : "bg-white"
                                } flex items-center rounded-md cursor-pointer p-2.5 ring-0 ring-transparent shadow`}
                              >
                                <span className="border border-solid border-surface-dark rounded-full w-5 h-5 mr-1.5"></span>
                                <span className="text-sm flex-1 flex justify-center">
                                  {variantSelected.name}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start gap-4">
                        <div className="">
                          <div className="text-xl max-sm:text-sm">
                            Recyle price will range between 500 - 1500 <br />{" "}
                            based on the product status
                          </div>
                        </div>
                        <div className="flex items-center text-5xl text-black bg-white w-fit mb-4">
                          <p className="opacity-40 text-sm">
                            Click on Recycle to know the recylce price
                          </p>
                        </div>
                      </div>
                    )}

                    {variantSelected.length != 0 ? (
                      <div
                        className="flex items-center w-fit bg-emerald-600 text-white px-4 py-2 rounded-md"
                        onClick={() => {
                          if (
                            productDetails.category.name
                              .toLowerCase()
                              .includes("mobile")
                          ) {
                            // setIsOpen(true);
                            setCheckMobileOn(true);
                          } else if (
                            productDetails.category.name
                              .toLowerCase()
                              .includes("laptop")
                          ) {
                            // setCheckLaptopAge(true);
                            setCheckLaptopOn(true);
                          }
                        }}
                      >
                        <button className="px-4">Recycle</button>
                        <FaAngleRight />
                      </div>
                    ) : (
                      <div>
                        <button
                          className="bg-emerald-500 mt-2 text-white px-8 py-2 rounded-md disabled:bg-gray-400 disabled:opacity-30 disabled:text-black"
                          disabled
                        >
                          Recycle
                        </button>
                      </div>
                    )}

                    {/* Disclaimer */}
                    {/* <div className="py-1 mt-2 px-2 w-3/4 bg-yellow-200 max-sm:w-full">
                      <p className="text-xs opacity-70">
                        The above pricing is subject to change based on the
                        product's condition. The final pricing offer will be
                        provided after the entire product has been inspected.
                      </p>
                    </div> */}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <RecycleContent heading={false} />

        {checkMobileOn && (
          <Modal
            heading={`Is Your ${productDetails.category.name} Switched On?`}
            categoryName={`${productDetails.category.name} Name`}
            productName={`${productDetails.name}`}
            leftHandler={handleMobileSwitchOn}
            leftHandlerText={`Switched On`}
            rightHandler={handleMobileSwitchOff}
            rightHandlerText={`Switched Off`}
          />
        )}

        {checkLaptopOn && (
          <Modal
            heading={`Is Your ${productDetails.category.name} Switched On?`}
            categoryName={`${productDetails.category.name} Name`}
            productName={`${productDetails.name}`}
            leftHandler={handleLaptopSwitchOn}
            leftHandlerText={`Switched On`}
            rightHandler={handleLaptopSwitchOff}
            rightHandlerText={`Switched Off`}
          />
        )}

        {checkLaptopAge && (
          <div>
            <Modal
              heading={` What is the age of your ${productDetails.category.name}?`}
              categoryName={`Laptop Name`}
              productName={`${productDetails.name}`}
              leftHandler={handleLaptopAge1}
              leftHandlerText={`Between 1-3 Years`}
              rightHandler={handleLaptopAge2}
              rightHandlerText={`More Than 3 Years`}
            />
          </div>
        )}

        {/* Would you like to recycle this item? */}
        {isOpen && (
          <div className="z-20 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 max-sm:p-4 rounded-lg shadow-lg w-[30%] max-lg:w-[60%] max-sm:w-[80%] max-2sm:w-[95%]">
              <div className="flex justify-center">
                <h2 className="text-xl max-sm:text-lg font-semibold mb-4 text-center">
                  Would You Like to Recycle this {productDetails.category.name}?
                </h2>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex gap-2 items-center">
                  <span>{productDetails.category.name} is</span>
                  <span className="text-lg max-sm:text-sm font-semibold">
                    {productDetails.category.name
                      .toLowerCase()
                      .includes("laptop")
                      ? laptopStatus
                      : mobileStatus}
                  </span>
                </div>

                {productDetails.category.name
                  .toLowerCase()
                  .includes("laptop") &&
                  laptopStatus.toLowerCase().includes("on") && (
                    <div className="flex gap-2 items-center my-2">
                      <span>{productDetails.category.name} Age</span>
                      <span className="text-lg max-sm:text-sm font-semibold border-b">
                        {ageSelected}
                      </span>
                    </div>
                  )}
                <div className="flex gap-2 items-center my-2">
                  <span>Recycle Price</span>
                  <span className="text-lg font-semibold">{recyclePrice}</span>
                </div>
                <div className="flex gap-4 items-center max-sm:text-sm">
                  <span>{productDetails.category.name} Name</span>
                  <span className="text-lg font-semibold max-sm:text-sm">
                    {productDetails.name}
                  </span>
                </div>
                {productDetails.category.name
                  .toLowerCase()
                  .includes("mobile") && (
                  <div className="flex gap-4 items-center">
                    <span>Variant</span>
                    <span className="text-lg max-sm:text-sm font-semibold">
                      {variantSelected.name}
                    </span>
                  </div>
                )}
              </div>
              {/* <div className="flex justify-around mt-8"> */}
              <div className="w-full flex items-center justify-center">
                {/* <div className="grid grid-cols-3 mt-8 items-center"> */}
                <div className="w-full flex justify-around mt-8 items-center">
                  <button
                    onClick={() => {
                      setOrderOpen(true);
                      //   setRecyclePrice(500);
                    }}
                    className="bg-green-600 text-white mx-auto px-4 py-1 rounded h-fit w-fit"
                  >
                    Yes
                  </button>
                  <img
                    src="/images/recycle1.png"
                    alt="logo"
                    className="w-[88px] h-[70px] max-2sm:w-[60px] max-2sm:h-[55px]"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-red-700 text-white mx-auto px-4 py-1 rounded h-fit w-fit"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fill out the details to book order */}
        {orderOpen && (
          <div className="z-20 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 max-sm:px-4 max-sm:py-2 rounded-lg shadow-lg w-[50%] max-lg:w-[90%]">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-4">
                  Enter your details
                </h2>
                <button
                  onClick={() => setOrderOpen(false)}
                  className=" bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  x
                </button>
              </div>
              <div>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3 justify-center"
                >
                  <FormInput
                    name="customerName"
                    pattern="^[A-Za-z]{3,16}"
                    placeholder="Enter Name"
                    errorMessage="Min 3 characters required..!"
                    required={true}
                  />
                  <FormInput
                    type="text"
                    name="email"
                    placeholder="Enter Email"
                  />
                  <FormInput
                    type="number"
                    name="phone"
                    placeholder="Enter Phone Number"
                    handleChange={handlePhoneChange}
                  />
                  <FormInput
                    type="text"
                    name="address"
                    placeholder="Enter your Address"
                  />
                  <div className="flex gap-4 items-center max-sm:flex-col max-sm:items-start max-sm:gap-1">
                    <FormInput
                      type="text"
                      name="state"
                      placeholder="Enter State"
                    />
                    <FormInput
                      type="text"
                      name="city"
                      placeholder="Enter City"
                    />
                    <FormInput
                      type="number"
                      name="pinCode"
                      placeholder="Enter Pincode"
                      handleChange={handlePinCodeChange}
                    />
                  </div>

                  <div className="flex items-center">
                    <h2 className="max-sm:text-sm">Select Date and Time: </h2>
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleTimeChange}
                      showTimeSelect
                      // timeFormat="HH:mm" // 24 hours
                      timeFormat="h:mm aa" // 12 hours
                      timeIntervals={30}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      timeCaption="Time"
                      minDate={currentDate}
                      minTime={minTime}
                      maxTime={maxTime}
                      className="border ml-1 p-1 rounded max-sm:text-sm max-sm:px-1 max-sm:py-[2px]"
                      placeholderText="Schedule Pickup"
                      required
                    />
                  </div>
                  <div>
                    {selectedDate && (
                      <p className="max-sm:text-sm">
                        Scheduled time:{" "}
                        <span className="font-semibold max-sm:text-xs">
                          {schedulePickUp}
                        </span>{" "}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center">
                      <FormInput
                        type="radio"
                        name="paymentMode"
                        value="Instant Cash"
                        checked={selectedPaymentMode === "Instant Cash"}
                        handlePayment={handlePaymentModeChange}
                      />

                      <div className="mx-2">
                        <img
                          src="/images/instantcash.webp"
                          alt="upi"
                          className="w-16 h-7 max-sm:w-12 max-sm:h-5"
                        />
                      </div>
                    </label>

                    <label className="flex items-center">
                      <FormInput
                        type="radio"
                        name="paymentMode"
                        value="Digital Payments"
                        checked={selectedPaymentMode === "Digital Payments"}
                        handlePayment={handlePaymentModeChange}
                      />
                      <div className="mx-2">
                        <img
                          src="/images/upi2.webp"
                          alt="upi"
                          className="w-14 h-7 max-sm:w-12 max-sm:h-5"
                        />
                      </div>
                    </label>

                    {selectedPaymentMode === "Digital Payments" && (
                      <div className="ml-6 mt-2 space-y-2">
                        <label className="flex items-center">
                          <FormInput
                            type="radio"
                            name="digitalPaymentMode"
                            value="GPay"
                            checked={selectedDigitalPayment === "GPay"}
                            handlePayment={handleDigitalPaymentChange}
                          />
                        </label>
                        <label className="flex items-center">
                          <FormInput
                            type="radio"
                            name="digitalPaymentMode"
                            value="PhonePe"
                            checked={selectedDigitalPayment === "PhonePe"}
                            handlePayment={handleDigitalPaymentChange}
                          />
                        </label>
                        <label className="flex items-center">
                          <FormInput
                            // id="upi"
                            type="radio"
                            name="digitalPaymentMode"
                            value="UPI"
                            checked={selectedDigitalPayment === "UPI"}
                            handlePayment={handleDigitalPaymentChange}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <input
                    type="submit"
                    value={`${!orderLoading ? "Sell" : "Loading..."} `}
                    name=""
                    className="border rounded px-2 py-1 w-1/5 bg-green-600 text-white cursor-pointer hover:bg-green-700 max-sm:text-sm disabled:bg-green-300 disabled:cursor-none"
                    disabled={orderLoading}
                  />
                </form>

                {/* OLD FORM WAS BELOW */}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RecycleProductDetail;

const Modal = ({
  heading,
  categoryName,
  productName,
  leftHandler,
  leftHandlerText,
  rightHandler,
  rightHandlerText,
}) => {
  return (
    <div className="z-20 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 max-sm:px-2 max-sm:py-5 rounded-lg shadow-lg w-[40%] max-lg:w-[60%] max-sm:w-[80%] max-2sm:w-[95%]">
        <div className="flex justify-center">
          <h2 className="text-xl font-semibold mb-4 text-center max-sm:text-sm">
            {heading}
          </h2>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex gap-4 items-center">
            <span className="max-sm:text-sm">{categoryName}</span>
            <span className="text-lg font-semibold max-sm:text-sm">
              {productName}
            </span>
          </div>
        </div>

        <div className="flex justify-around items-center gap-4 my-4 text-[16px] max-sm:text-sm">
          <div
            className="shadow-md shadow-green-300 hover:shadow-green-500 hover:shadow-inner bg-white text-green-600
            border border-green-600  text-center px-4 py-1 rounded cursor-pointer hover:bg-green-700 hover:text-white 
            transition-all ease-in-out duration-1000"
            onClick={leftHandler}
          >
            <span>{leftHandlerText}</span>
          </div>
          <div
            className="shadow-md shadow-red-300 hover:shadow-red-500 hover:shadow-inner text-red-600 border border-red-600 
            bg-white text-center px-4 py-1 rounded cursor-pointer hover:bg-red-700 hover:text-white 
            transition-all ease-in-out duration-1000"
            onClick={rightHandler}
          >
            <span>{rightHandlerText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// CheckMobileOn
{
  // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  //   <div className="bg-white p-8 rounded-lg shadow-lg w-[40%] max-lg:w-[60%] max-sm:w-[80%] max-2sm:w-[95%]">
  //     <div className="flex justify-center">
  //       <h2 className="text-xl font-semibold mb-4 text-center max-sm:text-sm">
  //         Is Your {productDetails.category.name} Switched On?
  //       </h2>
  //     </div>
  //     <div className="flex flex-col items-center">
  //       <div className="flex gap-4 items-center">
  //         <span className="max-sm:text-sm">
  //           {productDetails.category.name} Name
  //         </span>
  //         <span className="text-lg font-semibold max-sm:text-sm">
  //           {productDetails.name}
  //         </span>
  //       </div>
  //     </div>
  //     <div className="text-center mt-4">
  //       <span>Is Your {productDetails.category.name} Switched On?</span>
  //     </div>
  //     <div className="flex justify-around items-center gap-4 my-4">
  //       <div
  //         // className="border shadow-xl bg-green-600 text-slate-200 shadow-green-300 text-center px-4 py-1 rounded cursor-pointer hover:bg-green-700 hover:text-white max-2sm:px-1"
  //         className="shadow-xl bg-white text-green-600 border border-green-600 shadow-green-300 text-center px-4 py-1 rounded
  //                   cursor-pointer hover:bg-green-700 hover:text-white max-2sm:px-1 transition-all ease-in-out duration-1000"
  //         onClick={() => {
  //           setRecyclePrice(700);
  //           setMobileStatus("Switched On");
  //           setCheckMobileOn(false);
  //           setIsOpen(true);
  //         }}
  //       >
  //         <span>Switched On</span>
  //       </div>
  //       <div
  //         // className="bg-red-600 text-white text-center px-2 py-1 rounded cursor-pointer hover:bg-red-700"
  //         className="shadow-xl text-red-600 border border-red-600 shadow-red-300 bg-white  text-center px-4 py-1 rounded
  //                 cursor-pointer hover:bg-red-700 hover:text-white max-2sm:px-1 transition-all ease-in-out duration-1000"
  //         onClick={() => {
  //           setRecyclePrice(500);
  //           setMobileStatus("Switched Off");
  //           setCheckMobileOn(false);
  //           setIsOpen(true);
  //         }}
  //       >
  //         <span>Switched Off</span>
  //       </div>
  //     </div>
  //   </div>
  // </div>
}

// CheckLaptopOn
{
  /* <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 max-sm:px-2 max-sm:py-5 rounded-lg shadow-lg w-[40%] max-lg:w-[60%] max-sm:w-[80%] max-2sm:w-[95%]">
                <div className="flex justify-center">
                  <h2 className="text-xl font-semibold mb-4 text-center max-sm:text-sm">
                    Is Your {productDetails.category.name} Switched On?
                  </h2>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex gap-4 items-center">
                    <span className="max-sm:text-sm">
                      {productDetails.category.name} Name
                    </span>
                    <span className="text-lg font-semibold max-sm:text-sm">
                      {productDetails.name}
                    </span>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <span>
                    Is Your {productDetails.category.name} Switched On?
                  </span>
                </div>
                <div className="flex justify-around items-center gap-4 my-4 text-[16px] max-sm:text-sm">
                  <div
                    // className="border shadow-xl bg-green-600 text-slate-200 shadow-green-300 text-center px-4 py-1 rounded cursor-pointer hover:bg-green-700 hover:text-white max-2sm:px-1"
                    className="shadow-md shadow-green-300 hover:shadow-green-500 hover:shadow-inner bg-white text-green-600
                    border border-green-600  text-center px-4 py-1 rounded cursor-pointer hover:bg-green-700 hover:text-white 
                    transition-all ease-in-out duration-1000"
                    onClick={() => {
                      // setRecyclePrice(700);
                      setLaptopStatus("Switched On");
                      setCheckLaptopOn(false);
                      // setIsOpen(true);
                      setCheckLaptopAge(true);
                    }}
                  >
                    <span>Switched On</span>
                  </div>
                  <div
                    // className="border shadow-xl shadow-red-300 bg-red-600 text-slate-200 text-center px-4 py-1 rounded cursor-pointer hover:bg-red-700 hover:text-white max-2sm:px-1"
                    className="shadow-md shadow-red-300 hover:shadow-red-500 hover:shadow-inner text-red-600 border border-red-600 
                    bg-white text-center px-4 py-1 rounded cursor-pointer hover:bg-red-700 hover:text-white 
                    transition-all ease-in-out duration-1000"
                    onClick={() => {
                      setRecyclePrice(500);
                      setLaptopStatus("Switched Off");
                      setCheckLaptopOn(false);
                      setIsOpen(true);
                      // setCheckLaptopAge(true);
                    }}
                  >
                    <span>Switched Off</span>
                  </div>
                </div>
              </div>
            </div> */
}

// checkLaptopAge
{
  {
    /* <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  <div className="bg-white p-8 max-sm:p-4 rounded-lg shadow-lg w-[40%] max-lg:w-[60%] max-sm:w-[80%] max-2sm:w-[95%]">
    <div className="flex justify-center">
      <h2 className="text-xl font-semibold mb-4 text-center max-sm:text-sm">
        What is the age of your
        {productDetails.category.name}?
      </h2>
    </div>
    <div className="flex flex-col items-center">
      <div className="flex gap-4 items-center">
        <span className="max-sm:text-sm">Laptop Name</span>
        <span className="text-lg font-semibold max-sm:text-sm">
          {productDetails.name}
        </span>
      </div>
    </div>

    <div className="text-center mt-4">
      <span>Select Age Below to proceed</span>
    </div>
    <div className="flex justify-around items-center gap-4 my-4 text-[16px] max-sm:text-sm">
      <div
        // className="bg-blue-600 text-white text-center px-2 py-1 rounded cursor-pointer hover:bg-blue-700"
        className="border-2 hover:border-green-800 shadow-md rounded-lg text-center px-4 py-1 cursor-pointer 
                  hover:bg-green-700 hover:text-white transition-all ease-linear duration-1000"
        onClick={() => {
          setRecyclePrice(1500);
          setAgeSelected("Between 1-3 Years");
          setCheckLaptopAge(false);
          setIsOpen(true);
        }}
      >
        <span>Between 1-3 Years</span>
      </div>
      <div
        className="border-2 hover:border-green-800 shadow-md rounded-lg text-center px-4 py-1 cursor-pointer 
                  hover:bg-green-700 hover:text-white transition-all ease-linear duration-1000"
        onClick={() => {
          setRecyclePrice(500);
          // setAgeSelected(laptopAge[1]);
          setAgeSelected("More Than 3 Years");
          setCheckLaptopAge(false);
          setIsOpen(true);
        }}
      >
        <span>More Than 3 Years</span>
      </div>
    </div>
  </div>
</div> */
  }
}

// OLD FORM
{
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   let paymentMode;
  //   if (
  //     selectedPaymentMode === "" ||
  //     (selectedPaymentMode.toLowerCase().includes("digital") &&
  //       selectedDigitalPayment === "")
  //   ) {
  //     toast.error("Select Payment Mode..!");
  //     return;
  //   }
  //   console.log("formData", formData);
  //   const orderData = {
  //     ...formData,
  //     addressDetails,
  //     productDetails: {
  //       productName: productDetails.name,
  //       productBrand: productDetails.brand.name,
  //       productCategory: productDetails.category.name,
  //       productVariant: productDetails.category.name
  //         .toLowerCase()
  //         .includes("mobile")
  //         ? variantSelected.name
  //         : null,
  //       productAge: productDetails.category.name
  //         .toLowerCase()
  //         .includes("laptop")
  //         ? ageSelected
  //         : null,
  //       productStatus: productDetails.category.name
  //         .toLowerCase()
  //         .includes("mobile")
  //         ? mobileStatus
  //         : laptopStatus,
  //     },
  //     paymentMode: selectedPaymentMode.toLowerCase().includes("instant")
  //       ? selectedPaymentMode
  //       : selectedDigitalPayment,
  //     recyclePrice,
  //   };
  //   // console.log("orderData", orderData);
  //   // const order = await createOrder(formData);
  //   // const order = await createRecycleOrder(orderData);
  //   // // console.log("order", order);
  //   // if (order.data.success) {
  //   //   //   closeModal();
  //   //   //   setOrderOpen(false);
  //   //   toast.success("Your Order placed successfully");
  //   //   navigate(`/recycle-categories`);
  //   // }
  // };
  /* <form
                  action=""
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3 justify-center"
                >
                  <div>
                    <label htmlFor="name" className="max-sm:text-md">
                      Name:{" "}
                    </label>
                    <input
                      type="text"
                      name="name"
                      id=""
                      placeholder="Enter Name"
                      className="border rounded px-2 py-1 w-1/3 max-sm:w-1/2 max-sm:text-sm max-sm:px-1 max-sm:py-0"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email">Email: </label>
                    <input
                      type="email"
                      name="email"
                      id=""
                      placeholder="Enter email"
                      className="border rounded px-2 py-1 w-1/3 max-sm:w-1/2 max-sm:text-sm max-sm:px-1 max-sm:py-0"
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone">Phone Number: </label>
                    <input
                      type="number"
                      name="phone"
                      value={formData?.phone}
                      placeholder="Enter phone number"
                      className="border rounded px-2 py-1 w-1/3 max-sm:w-1/2 max-sm:text-sm max-sm:px-1 max-sm:py-0"
                      // onChange={(e) =>
                      //   setFormData({ ...formData, phone: Number(e.target.value) })
                      // }
                      onChange={handlePhoneChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="address">Address: </label>
                    <input
                      type="text"
                      name="address"
                      // value={addressDetails.address}
                      id=""
                      placeholder="Add your address"
                      className="border w-[75%] rounded px-2 py-1 max-sm:text-sm max-sm:px-1 max-sm:py-0"
                      onChange={(e) =>
                        setAddressDetails({
                          ...addressDetails,
                          address: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="flex gap-4 items-center max-sm:flex-col max-sm:items-start max-sm:gap-1">
                    <div>
                      <label htmlFor="city">State: </label>
                      <input
                        type="text"
                        // value={addressDetails.state}
                        id=""
                        placeholder="Enter State"
                        className="border rounded px-2 py-1 max-sm:text-sm max-sm:px-1 max-sm:py-0"
                        onChange={(e) =>
                          setAddressDetails({
                            ...addressDetails,
                            state: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="">
                      <label htmlFor="pincode">City: </label>
                      <input
                        type="text"
                        name="city"
                        // value={addressDetails.city}
                        placeholder="Enter City"
                        className="border rounded px-2 py-1 max-sm:text-sm max-sm:px-1 max-sm:py-0"
                        onChange={(e) =>
                          setAddressDetails({
                            ...addressDetails,
                            city: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="max-sm:text-md">
                        PinCode:{" "}
                      </label>
                      <input
                        type="number"
                        name="pinCode"
                        // value={addressDetails.pinCode}
                        id=""
                        placeholder="Add PinCode"
                        className="border rounded px-2 py-1 max-sm:text-sm max-sm:px-1 max-sm:py-0"
                        onChange={handlePinCodeChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <h2 className="max-sm:text-md">Select Date and Time:</h2>{" "}
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleTimeChange}
                      showTimeSelect
                      // timeFormat="HH:mm" // 24 hours
                      timeFormat="h:mm aa" // 12 hours
                      timeIntervals={30}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      timeCaption="Time"
                      minDate={currentDate}
                      minTime={minTime}
                      maxTime={maxTime}
                      className="border ml-1 p-1 rounded max-sm:text-sm max-sm:px-1 max-sm:py-[2px]"
                      placeholderText="Schedule Pickup"
                      required
                    />
                  </div>
                  <div>
                    {selectedDate && (
                      <p>
                        Scheduled time:{" "}
                        <span className="font-semibold">
                          {formData.schedulePickUp}
                        </span>{" "}
                      </p>
                    )}
                  </div>

                  <div className="pb-2">
                    <h2 className="text-xl mb-4">Select Payment Mode</h2>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          id="instantCash"
                          type="radio"
                          name="paymentMode"
                          value="Instant Cash"
                          checked={selectedPaymentMode === "Instant Cash"}
                          onChange={handlePaymentModeChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          Instant Cash
                        </span>
                        <div className="mx-2">
                          <img
                            src="/images/instantcash.webp"
                            alt="upi"
                            className="w-16 h-7"
                          />
                        </div>
                      </label>
                      <label className="flex items-center">
                        <input
                          id="digitalPayments"
                          type="radio"
                          name="paymentMode"
                          value="Digital Payments"
                          checked={selectedPaymentMode === "Digital Payments"}
                          onChange={handlePaymentModeChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          Digital Payments
                        </span>
                        <div className="mx-2">
                          <img
                            src="/images/upi2.webp"
                            alt="upi"
                            className="w-14 h-7"
                          />
                        </div>
                      </label>

                      {selectedPaymentMode === "Digital Payments" && (
                        <div className="ml-6 mt-2 space-y-2">
                          <label className="flex items-center">
                            <input
                              id="gpay"
                              type="radio"
                              name="digitalPaymentMode"
                              value="GPay"
                              checked={selectedDigitalPayment === "GPay"}
                              onChange={handleDigitalPaymentChange}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              GPay
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              id="phonepe"
                              type="radio"
                              name="digitalPaymentMode"
                              value="PhonePe"
                              checked={selectedDigitalPayment === "PhonePe"}
                              onChange={handleDigitalPaymentChange}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              PhonePe
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              id="upi"
                              type="radio"
                              name="digitalPaymentMode"
                              value="UPI"
                              checked={selectedDigitalPayment === "UPI"}
                              onChange={handleDigitalPaymentChange}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              UPI
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <input
                    type="submit"
                    value={`${!orderLoading ? "Sell" : "Loading..."} `}
                    name=""
                    className="border rounded px-2 py-1 w-1/5 bg-green-600 text-white cursor-pointer hover:bg-green-700 max-sm:text-sm disabled:bg-green-300 disabled:cursor-none"
                    disabled={orderLoading}
                  />
                </form>{" "} */
}
