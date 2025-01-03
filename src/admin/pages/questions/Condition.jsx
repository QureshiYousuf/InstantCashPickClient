import React, { useState } from "react";
import {
  useCreateConditionsMutation,
  useGetCategoryQuery,
} from "../../../features/api";
import { toast } from "react-toastify";
import ListButton from "../../components/ListButton";
import { useDispatch, useSelector } from "react-redux";
import { filterCategory } from "../../features/filterSlice";

function Condtions() {
  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryQuery();
  const [createConditions, { isLoading: createConditonLoading }] =
    useCreateConditionsMutation();

  const filterData = useSelector((state) => state.filter.conditionsList);
  //   console.log("filterData from Conditions", filterData);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    category: filterData.category,
    conditionName: "",
    page: "",
  });

  console.log("formData", formData);

  // Function to handle changes in the form fields
  const handleChange = (event, field, conditionName) => {
    const { value } = event.target;
    const updatedFormData = { ...formData };
    updatedFormData[conditionName] = value;
    setFormData(updatedFormData);
  };

  // console.log("condition formData", formData);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("handleSubmit", formData);

    try {
      const condition = await createConditions(
        JSON.stringify(formData)
      ).unwrap();
      console.log("condition created", condition);
      if (condition.message?.includes("Duplicate")) {
        toast.warning(condition.message);
        return;
      } else if (condition.message?.includes("Create atleast one")) {
        toast.warning(condition.message);
        return;
      }
      toast.success("Conditions created successfull..!");
    } catch (error) {
      console.log("Error while creating condition:- ", error);
      toast.error("Conditions creation failed..!");
    }
  };

  return (
    // <div className="flex gap-4">
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="bold text-lg max-sm:text-sm mb-2">Create Condition</h1>
        <ListButton
          location={"/admin/conditionsList"}
          text={"Conditions List"}
        />
      </div>
      {/* Create Condition BOX */}
      <div className="flex">
        <div className="bg-white flex justify-center border rounded-md shadow-lg w-full">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center gap-4 px-4 max-sm:px-2 py-4 max-sm:py-2"
          >
            <div>
              <h2 className="text-lg max-sm:text-sm">Add Condition</h2>
            </div>
            <hr />

            {/* Select Category */}
            <div className="flex max-sm:flex-col items-center gap-2">
              <label>Category:</label>
              <select
                className="border p-1 rounded text-lg max-sm:text-sm"
                value={formData.category}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  });
                  dispatch(
                    filterCategory({
                      category: e.target.value,
                      from: "conditionsList",
                    })
                  );
                }}
                required
              >
                <option value="">Select a category</option>
                {categoryData?.map((category) => (
                  <option key={category.id} value={category.id} name="category">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full max-lg:grid-cols-1">
              {/* Condition Name */}
              <div className="flex items-center max-sm:flex-col">
                <div className="flex items-center max-sm:flex-col">
                  <label>Condition Name:</label>
                  <input
                    type="text"
                    name="name"
                    className="border mx-2 py-1 px-2 rounded text-sm max-sm:text-xs"
                    placeholder="Enter Condition Name"
                    value={formData.conditionName}
                    onChange={(event) =>
                      handleChange(event, "name", "conditionName")
                    }
                    required
                  />
                </div>

                {/* Page No */}
                <div className="flex items-center max-sm:flex-col">
                  <label>Page:</label>
                  <input
                    type="number"
                    name="page"
                    className="border mx-2 py-1 px-2 rounded text-sm max-sm:text-xs"
                    placeholder="Enter Page Number"
                    value={formData.page}
                    onChange={(event) => handleChange(event, "name", "page")}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="py-3 px-2">
              <button
                type="submit"
                className={`w-fit px-4 bg-green-600 text-white rounded-md p-1 cursor-pointer hover:bg-green-700 disabled:cursor-none disabled:bg-gray-300`}
                disabled={createConditonLoading}
              >
                {!createConditonLoading ? "Create Condition" : "Loading..."}
              </button>
            </div>
          </form>
        </div>

        {/* condition List */}
        {/* <div className="mt-5 ml-5 overflow-y-auto scrollbar max-h-[250px]">
            <p className="w-full text-xl font-semibold">
              List of selected category's conditions
            </p>
            <ul className="">
              {!conditionsLoading &&
                conditionsData
                  ?.filter((cond) => cond.category.id == formData.category)
                  .map((condition) => (
                    <li className="bg-white text-lg px-4 py-2">
                      {condition.conditionName}
                    </li>
                  ))}
            </ul>
          </div> */}
      </div>
    </div>
    // </div>
  );
}

export default Condtions;
