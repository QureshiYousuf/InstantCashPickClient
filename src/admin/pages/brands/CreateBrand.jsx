import React, { useEffect, useState, useRef } from "react";
import {
  useGetCategoryQuery,
  useCreateBrandMutation,
  useUploadFileHandlerMutation,
  useUploadBrandImageMutation,
} from "../../../features/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ListButton from "../../components/ListButton";

const CreateBrand = () => {
  const [brand, setBrand] = useState("");
  const [uniqueURL, setUniqueURL] = useState("");
  const [imageSelected, setImageSelected] = useState("");
  const [categorySelected, setCategorySelected] = useState();
  const [createBrand, { isLoading: createBrandLoading }] =
    useCreateBrandMutation();
  const [uploadBrandImage, { isLoading: uploadLoadingNew }] =
    useUploadBrandImageMutation();
  // const [brandsData, setCategories] = useState([]);
  const { data: categories, isLoading } = useGetCategoryQuery();

  // Create a ref to store the reference to the file input element
  const fileInputRef = useRef(null);

  // File handler
  const uploadFileHandler = async () => {
    const formData = new FormData();
    formData.append("image", imageSelected);
    formData.append("uploadDir", "brands/");

    try {
      const res = await uploadBrandImage(formData).unwrap();
      // console.log("Brand res.image", res.image);

      return res.image;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Image upload handler call
    const imageURL = await uploadFileHandler();

    // console.log("handlesubmit ", categorySelected, brand, uniqueURL, imageURL);
    const brandData = {
      category: categorySelected,
      name: brand,
      uniqueURL: uniqueURL,
      image: imageURL,
    };

    try {
      // const brandCreated = await createBrand(
      //   JSON.stringify(brandData)
      // ).unwrap();

      const brandCreated = createBrand(JSON.stringify(brandData));
      brandCreated
        .then((data) => {
          console.log("brand promise", data);
          toast.success("Brand created successfull..!");
          // Clear the value of the file input
          fileInputRef.current.value = "";
          // Mark the file input as required again
          fileInputRef.current.required = true;
        })
        .catch((err) => console.log("Error in promise creating brand", err));

      console.log("brand created", brandCreated);

      // setBrand("");
      // setUniqueURL("");
      // setImageSelected("");
    } catch (error) {
      console.log("Error in try block of creating brand: ", error);
    }
  };

  return (
    <div className=" px-[2%] pt-[2%] ">
      <div className="flex justify-between items-center">
        <h1 className="bold text-[1.4rem] mb-2">Create Brand</h1>
        <div className="flex gap-2">
          <div className="flex items-center">
            <h2>Home </h2>
            <h2 className="pl-1"> / Add Brands</h2>
          </div>

          <ListButton location={"/admin/brands-list"} text={"Brands List"} />
        </div>
      </div>
      <div className="bg-white border rounded-md shadow-lg">
        <form
          method="post"
          className="flex flex-col gap-4  p-5"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <div>
            <h2 className="">Add Brand</h2>
          </div>
          <hr />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="productName">Select Category :</label>

              <select
                className="border w-[40%]"
                value={categorySelected}
                onChange={(e) => {
                  // console.log(e.target.value);
                  setCategorySelected(e.target.value);
                }}
              >
                <option value="">Select Category</option>
                {!isLoading &&
                  categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      name="category"
                      className=""
                    >
                      {/* {console.log(
                        "category: ",
                        category.name,
                        ", ID: ",
                        category.id
                      )} */}
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="productName">Brand Name :</label>
              <input
                type="text"
                id="productName"
                className=" border p-2 rounded-sm"
                placeholder="Enter Category Name"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="uniqueURL">Make Unique URL :</label>
              <input
                type="text"
                id="uniqueURL"
                value={uniqueURL}
                onChange={(e) => setUniqueURL(e.target.value)}
                className=" border p-2 rounded-sm"
                placeholder="Enter Unique URL"
                required
              />
            </div>

            <div className="p-2">
              <label htmlFor="image">File Input</label>
              <div className="flex">
                <div className="mb-4">
                  <label htmlFor="image" className="block font-medium">
                    Image:
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    ref={fileInputRef}
                    accept="image/*"
                    className="w-full border border-gray-300 p-2 rounded-md"
                    onChange={(e) => setImageSelected(e.target.files[0])}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="py-3 px-2">
            <button
              type="submit"
              className={`w-[20%] bg-green-600 text-white rounded-md p-1 cursor-pointer hover:bg-green-700 disabled:cursor-none disabled:bg-gray-300`}
              disabled={createBrandLoading}
            >
              {!createBrandLoading ? "Create Brand" : "Loading..."}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBrand;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchCategories,
//   selectAllCategories,
// } from "../../features/categorySlice";

// function CreateBrand() {
//   const dispatch = useDispatch();
//   const categories = useSelector(selectAllCategories);
//   console.log("categories", categories);

//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   return (
//     <div>
//       <h2>Select Category</h2>
//       <select>
//         {categories.map((category) => (
//           <option key={category.id} value={category.id}>
//             {category.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// export default CreateBrand;
