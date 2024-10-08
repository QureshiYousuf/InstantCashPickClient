import React, { useState } from "react";
import {
  useGetConditionsQuery,
  useGetCategoryQuery,
  useGetConditionLabelsQuery,
  useDeleteConditionLabelMutation,
} from "../../../features/api";
import BackButton from "../../components/BackButton";
import EditButton from "../../components/EditButton";
import { toast } from "react-toastify";

const ConditionLabelsTable = () => {
  const { data: conditionsData, isLoading: conditionsLoading } =
    useGetConditionsQuery();
  const { data: conditionLabelsData, isLoading: conditionLabelsLoading } =
    useGetConditionLabelsQuery();
  const [deleteConditionLabel, { isLoading: deleteLoading }] =
    useDeleteConditionLabelMutation();
  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoryQuery();

  // if (conditionLabelsData) {
  //   console.log("conditionLabelsData", conditionLabelsData);
  // }

  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [selectedCondition, setSelectedCondition] = useState(undefined);

  const handleDelete = async (category, conditionLabelId, conditionLabel) => {
    console.log(category, conditionLabelId);
    try {
      await deleteConditionLabel({ category, conditionLabelId });
      toast.success(`Successfully deleted Condition Label ${conditionLabel}`);
    } catch (error) {
      toast.error(`Failed deleting Condition Label ${conditionLabel}`);
      console.log(error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-black text-lg font-bold mb-4">
        ConditionLabels Table
      </h2>
      <div className="flex justify-between">
        <div className="flex items-center gap-4 mb-4">
          <div>
            <label htmlFor="condition" className=" mr-2">
              Select Category:
            </label>
            <select
              id="condition"
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedCondition("");
              }}
              value={selectedCategory}
              className="px-2 py-1 rounded border text-black"
            >
              <option value="">Search</option>
              {!categoriesLoading &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <div className=" overflow-hidden">
            <label htmlFor="condition" className=" mr-2">
              Select ConditionLabel:
            </label>
            <select
              id="condition"
              onChange={(e) => setSelectedCondition(e.target.value)}
              value={selectedCondition}
              className="px-2 py-1 rounded border text-black"
            >
              <option value="">Search</option>
              {!conditionsLoading &&
                conditionsData
                  .filter((c) => c.category.id === selectedCategory)
                  .map((cond) => (
                    <option key={cond.id} value={cond.id}>
                      {cond.conditionName}
                    </option>
                  ))}
            </select>
          </div>
        </div>

        <BackButton
          location={"/admin/create-questions"}
          text={"Create ConditionLabels"}
        />
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-white bg-gray-800">Category</th>
            <th className="px-4 py-2 text-white bg-gray-800">Condition</th>
            <th className="px-4 py-2 text-white bg-gray-800">
              Condition Label
            </th>
            <th className="px-4 py-2 text-white bg-gray-800">
              Condition Label Image
            </th>
            <th className="px-4 py-2 text-white bg-gray-800">Edit & Delete</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {!conditionLabelsLoading && !categoriesLoading && !selectedCategory
            ? conditionLabelsData.map((conditionLabel, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-200" : "bg-white"}
                >
                  <td className=" py-2">{conditionLabel.category?.name}</td>
                  <td className=" py-2">
                    {conditionLabel.conditionNameId?.conditionName}
                  </td>
                  <td className=" py-2">{conditionLabel.conditionLabel}</td>
                  <td className=" py-2">
                    {conditionLabel.conditionLabelImg ? (
                      <img
                        src={
                          import.meta.env.VITE_APP_BASE_URL +
                          conditionLabel.conditionLabelImg
                        }
                        alt="CAT"
                        className="w-[60px] h-[60px] mx-auto "
                      />
                    ) : (
                      <p className="text-red-500">No Image</p>
                    )}
                  </td>
                  <td className="text-white py-2">
                    <div className="flex gap-2 justify-center">
                      <EditButton
                        location={`/admin/updateConditionLabel/${conditionLabel.id}`}
                      />
                      <button
                        className="bg-red-600 px-3 py-1 rounded-md disabled:cursor-none disabled:bg-gray-400"
                        onClick={() =>
                          handleDelete(
                            conditionLabel.category.id,
                            conditionLabel.id,
                            conditionLabel.conditionLabel
                          )
                        }
                        disabled={deleteLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            : !conditionLabelsLoading && !selectedCondition
            ? conditionLabelsData
                .filter((cl) => cl.category?.id === selectedCategory)
                .map((conditionLabel, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-200" : "bg-white"}
                  >
                    <td className=" py-2">{conditionLabel.category.name}</td>
                    <td className=" py-2">
                      {conditionLabel.conditionNameId?.conditionName}
                    </td>
                    <td className=" py-2">{conditionLabel.conditionLabel}</td>
                    <td className=" py-2">
                      {conditionLabel.conditionLabelImg ? (
                        <img
                          src={
                            import.meta.env.VITE_APP_BASE_URL +
                            conditionLabel.conditionLabelImg
                          }
                          alt="CAT"
                          className="w-[60px] h-[60px] mx-auto "
                        />
                      ) : (
                        <p className="text-red-500">No Image</p>
                      )}
                    </td>
                    <td className="text-white py-2">
                      <div className="flex gap-2 justify-center">
                        <EditButton
                          location={`/admin/updateConditionLabel/${conditionLabel.id}`}
                        />
                        <button
                          className="bg-red-600 px-3 py-1 rounded-md disabled:cursor-none disabled:bg-gray-400"
                          onClick={() =>
                            handleDelete(
                              conditionLabel.category.id,
                              conditionLabel.id,
                              conditionLabel.conditionLabel
                            )
                          }
                          disabled={deleteLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            : !conditionLabelsLoading &&
              conditionLabelsData
                .filter((cl) => cl.category.id === selectedCategory)
                .filter((cl) => cl.conditionNameId?.id === selectedCondition)
                .map((conditionLabel, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-200" : "bg-white"}
                  >
                    <td className=" py-2">{conditionLabel.category.name}</td>
                    <td className=" py-2">
                      {conditionLabel.conditionNameId?.conditionName}
                    </td>
                    <td className=" py-2">{conditionLabel.conditionLabel}</td>
                    <td className=" py-2">
                      {conditionLabel.conditionLabelImg ? (
                        <img
                          src={
                            import.meta.env.VITE_APP_BASE_URL +
                            conditionLabel.conditionLabelImg
                          }
                          alt="CAT"
                          className="w-[60px] h-[60px] mx-auto "
                        />
                      ) : (
                        <p className="text-red-500">No Image</p>
                      )}
                    </td>
                    <td className="text-white py-2">
                      <div className="flex gap-2 justify-center">
                        <EditButton
                          location={`/admin/updateConditionLabel/${conditionLabel.id}`}
                        />
                        <button
                          className="bg-red-600 px-3 py-1 rounded-md disabled:cursor-none disabled:bg-gray-400"
                          onClick={() =>
                            handleDelete(
                              conditionLabel.category.id,
                              conditionLabel.id,
                              conditionLabel.conditionLabel
                            )
                          }
                          disabled={deleteLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConditionLabelsTable;
