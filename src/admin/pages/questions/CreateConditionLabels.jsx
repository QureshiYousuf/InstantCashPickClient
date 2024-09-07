import React, { useState, useRef } from "react";
import {
  useGetConditionsQuery,
  useGetCategoryQuery,
  useCreateConditionLabelsMutation,
  useUploadConditionLabelsImageMutation,
  useGetConditionLabelsQuery,
} from "../../../features/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ListButton from "../../components/ListButton";

const CreateConditionLabels = () => {
  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryQuery();
  const { data: conditionsData, isLoading: conditionsLoading } =
    useGetConditionsQuery();
  const { data: conditionsLabelsData, isLoading: conditionsLabelsLoading } =
    useGetConditionLabelsQuery();
  const [uploadConditionLabelsImage, { isLoading: uploadLoading }] =
    useUploadConditionLabelsImageMutation();
  const [createConditionLabels, { isLoading: createConditionLabelsLoading }] =
    useCreateConditionLabelsMutation();

  // Create a ref to store the reference to the file input element
  const fileInputRef = useRef(null);

  const [imageSelected, setImageSelected] = useState();

  const [formData, setFormData] = useState({
    category: "",
    conditionNameId: "",
    // condition: "",
    conditionLabel: "",
    conditionLabelImg: undefined,
  });

  // File handler
  const uploadFileHandler = async () => {
    const imageData = new FormData();
    // formData.append("image", imageSelected);
    imageData.append("image", formData.conditionLabelImg);

    try {
      const res = await uploadConditionLabelsImage(imageData).unwrap();

      return res.image;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handle submit");

    if (formData.conditionLabelImg) {
      formData.conditionLabelImg = await uploadFileHandler();
    }

    // console.log("conditionLabelData: ", formData);

    try {
      const conditionLabel = await createConditionLabels(
        JSON.stringify(formData)
      ).unwrap();
      // productId = product.id;
      console.log("conditionLabel created", conditionLabel);
      if (conditionLabel.message?.toLowerCase().includes("duplicate")) {
        toast.warning(`${conditionLabel.message}`);
      } else {
        toast.success("conditionLabel created successfully..!");
      }
      // Clear the value of the file input
      fileInputRef.current.value = "";
      // Mark the file input as required again
      // fileInputRef.current.required = true;
      formData.conditionLabelImg = undefined;

      // setFormData({
      //   category: "",
      //   conditionNameId: "",
      //   conditionLabel: "",
      //   conditionLabelImg: undefined,
      // });
    } catch (error) {
      console.log(
        "Error while creating conditionLabel using API call: ",
        error
      );
      toast.error("Error while creating conditionLabel..!");
    }
  };

  // console.log("TEST", conditionsLabelsData && conditionsLabelsData);

  return (
    <div className="flex w-[90%] mt-[2%]">
      <div className="flex gap-4 w-full">
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h1 className="bold text-[1.4rem] mb-2">Create ConditionLabels</h1>
            <div className="flex items-center gap-1">
              <h2>Home </h2>
              <h2 className="pl-1"> / Add ConditionLabels</h2>

              <ListButton
                location={"/admin/conditionLabelsList"}
                text={"ConditionLabels List"}
              />
            </div>
          </div>
          <div className="bg-white w-full flex border rounded-md shadow-lg">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 p-5 w-full"
            >
              <div>
                <h2 className="">Add ConditionLabels</h2>
              </div>
              <hr />

              <div className="flex">
                <div className="grid grid-cols-2 gap-2">
                  {/* Select Category */}
                  <div className="flex flex-col">
                    <label>Category:</label>
                    <select
                      name=""
                      id=""
                      value={formData.category}
                      className="border p-1 rounded"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          category: e.target.value,
                        });
                      }}
                      required
                    >
                      <option value="">Select a category</option>
                      {!categoryLoading &&
                        categoryData.map((category) => (
                          <option
                            key={category.id}
                            value={category.id}
                            name="category"
                            className=""
                          >
                            {category.name}
                          </option>
                        ))}
                    </select>{" "}
                  </div>

                  {/* Select Condition */}
                  <div className="flex flex-col">
                    <label>ConditionsLabel:</label>
                    <select
                      name=""
                      id=""
                      className="border p-1 rounded"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          // condition: e.target.value,
                          conditionNameId: e.target.value,
                        });
                      }}
                      required
                    >
                      <option value="">Select a condition</option>
                      {!conditionsLoading &&
                        conditionsData.map(
                          (condition) =>
                            condition.category.id == formData.category && (
                              <option
                                key={condition.id}
                                value={condition.id}
                                name="condition"
                                className=""
                              >
                                {condition.conditionName}
                              </option>
                            )
                        )}
                    </select>{" "}
                  </div>

                  {/* Enter ConditionLabel */}
                  <div className="py-2">
                    <label>ConditionLabel:</label>
                    <input
                      type="text"
                      name="label"
                      value={formData.conditionLabel.label}
                      className="border mx-2 py-1 px-2 rounded text-[15px]"
                      placeholder="Enter Condition Label"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          conditionLabel: e.target.value,
                        });
                      }}
                      required
                    />
                  </div>

                  <div className="py-2">
                    <input
                      type="file"
                      name="image"
                      ref={fileInputRef}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          conditionLabelImg: e.target.files[0],
                        });
                      }}
                      // onChange={(e) => setImageSelected(e.target.files[0])}
                      // required
                    />
                  </div>
                </div>
              </div>

              <div className="py-3 px-2">
                <button
                  type="submit"
                  className={`w-[20%] bg-green-600 text-white rounded-md p-1 cursor-pointer hover:bg-green-700 disabled:cursor-none disabled:bg-gray-300`}
                  disabled={createConditionLabelsLoading}
                >
                  {!createConditionLabelsLoading
                    ? "Create ConditionLabel"
                    : "Loading..."}
                </button>
              </div>
            </form>
            {/* condition List */}
            <div className="mt-5 ml-5 overflow-y-auto scrollbar max-h-[250px]">
              <p className="w-full text-xl font-semibold">
                List of selected condition's conditionLabels
              </p>
              <ul className="">
                {!conditionsLabelsLoading &&
                  conditionsLabelsData
                    .filter((cl) => cl.category.id == formData.category)
                    .filter(
                      (cl) => cl.conditionNameId?.id == formData.conditionNameId
                    )
                    .map((condition, index) => (
                      <li key={index} className="bg-white text-lg px-4 py-2">
                        {index + 1}. {condition.conditionLabel}
                      </li>
                    ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CreateConditionLabels);
