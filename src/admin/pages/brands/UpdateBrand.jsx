import React, { useEffect, useState, useRef } from "react";
import {
  useGetAllBrandQuery,
  useUpdateBrandMutation,
  useUploadBrandImageMutation,
} from "../../../features/api";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BackButton from "../../components/BackButton";
import CardHeader from "../../components/CardHeader";
import UpdateButton from "../../components/UpdateButton";

function UpdateBrand() {
  const { brandId } = useParams();
  //   console.log(brandId);

  const { data: brandsData, isLoading: brandsLoading } = useGetAllBrandQuery();
  const [newImgSelected, setNewImgSelected] = useState(false);
  const [uploadBrandImage, { isLoading: uploadLoading }] =
    useUploadBrandImageMutation();
  const [
    updateBrand,
    { isLoading: updateBrandLoading, isError: updateBrandError },
  ] = useUpdateBrandMutation();

  // Create a ref to store the reference to the file input element
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    category: "",
    name: "",
    image: "",
  });

  let brandToUpdate;
  if (!brandsLoading) {
    brandToUpdate = brandsData.filter((brand) => brand.id == brandId);
  }

  useEffect(() => {
    if (brandsData) {
      console.log("useEffect", brandToUpdate);
      setFormData((prevFormData) => ({
        ...prevFormData,
        category: brandToUpdate[0].category.id,
        name: brandToUpdate[0].name,
        image: brandToUpdate[0].image,
      }));
    }
  }, [brandsData]);

  console.log(formData);

  // File handler
  const uploadFileHandler = async () => {
    const imageData = new FormData();
    // formData.append("image", imageSelected);
    imageData.append("image", formData.image);

    try {
      const res = await uploadBrandImage(imageData).unwrap();

      return res.image;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("handle submit");
    // console.log(formData);

    if (newImgSelected) {
      console.log("image changed");
      formData.image = await uploadFileHandler();
    }
    console.log("after image", formData);

    try {
      const updatedBrand = await updateBrand({
        brandId: brandId,
        data: formData,
      }).unwrap();
      console.log("Brand updated", updatedBrand);
      toast.success("Brand updated successfully..!");
      // Clear the value of the file input
      fileInputRef.current.value = "";
      // Mark the file input as required again
      fileInputRef.current.required = true;
      // Handle success
    } catch (error) {
      console.error("Error updating condition:", error);
      toast.error("Brand update failed..!");
    }

    // Send formData to backend or perform any other action
    // console.log("handleSubmit", formData);
  };

  return (
    <>
      <div className="flex mt-[5%] w-[80%] mx-auto">
        <div className="grow">
          {/* <div className="flex justify-between items-center">
            <h1 className="bold text-[1.4rem] mb-2">Update Brand</h1>
            <div className="flex items-center gap-1">
              <h2>Home </h2>
              <h2 className="pl-1"> / Update Brand</h2>

              <BackButton location={"/admin/brands-list"} />
            </div>
          </div> */}

          <CardHeader
            location={"/admin/brands-list"}
            text="Update Brand"
            source="update"
          />

          <div className="bg-white border rounded-md shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 ">
              <div className="flex gap-2 items-center">
                <span className="text-xl opacity-75">Update </span>
                {!brandsLoading && (
                  <h2 className="text-2xl ">
                    {brandToUpdate[0].category.name}{" "}
                  </h2>
                )}
                <span className="text-xl opacity-75">Brand</span>
              </div>
              <hr />
              <div className="grid grid-cols-2 gap-2 w-full max-lg:grid-cols-1">
                {!brandsLoading && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <label htmlFor="conditioName">Brand Name</label>
                      <h2
                        name="conditioName"
                        className="text-[1.7rem] text-red-700"
                      >
                        {brandToUpdate[0].name}
                      </h2>
                    </div>
                    <div className="flex items-center max-sm:flex-col">
                      <div className="flex w-full max-sm:flex-col">
                        <label className="">Update Brand Name:</label>
                        <input
                          type="text"
                          name="conditionName"
                          className="border mx-2 py-1 px-2 rounded text-[15px]"
                          placeholder="Enter Condition Name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center grow-0">
                        <img
                          src={
                            import.meta.env.VITE_APP_BASE_URL + formData.image
                          }
                          alt="ConditionLabel"
                          className="w-[100px] h-[100px] mx-auto "
                        />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              image: e.target.files[0],
                            });
                            setNewImgSelected(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* <div className="py-3 px-2">
                <button
                  type="submit"
                  className={`w-[20%] bg-green-600 text-white rounded-md p-1 cursor-pointer hover:bg-green-700 disabled:cursor-none disabled:bg-gray-300`}
                  disabled={updateBrandLoading}
                >
                  {!updateBrandLoading ? "Update Brand" : "Loading..."}
                </button>
              </div> */}
              <UpdateButton
                updateLoading={updateBrandLoading}
                text="Update Brand"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateBrand;
