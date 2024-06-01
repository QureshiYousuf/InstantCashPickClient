import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addScreenSize, addGraphic } from "../../features/laptopDeductionSlice";

const DeductionItems = ({
  conditionName,
  conditionLabels,
  handleLabelSelection,
  handleContinue,
}) => {
  const deductionData = useSelector((state) => state.deductions.deductions);

  const dispatch = useDispatch();

  const laptopSliceData = useSelector((state) => state.laptopDeductions);
  console.log("laptopSliceData", laptopSliceData);

  // Determine if the image should be shown based on the condition name
  const shouldShowImage = !(
    (conditionName.includes("Screen Size") || conditionName.includes("Graphic"))
    // || conditionName.toLowerCase().includes("screen")
  );

  console.log("shouldHideImage", shouldShowImage);

  return (
    // <div key={index}>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 md:grid-cols-3 items-center px-4">
      {conditionLabels.map((label, index) => (
        <div
        key={index}
          className={`${
            shouldShowImage
              ? deductionData.some(
                  (condLabel) =>
                    condLabel.conditionLabel == label.conditionLabel
                )
                ? " border-cyan-500"
                : ""
              : laptopSliceData.screenSize.conditionLabel ===
                  label.conditionLabel ||
                laptopSliceData.graphic.conditionLabel === label.conditionLabel
              ? "border-cyan-500"
              : ""
          } flex flex-col border rounded items-center`}
          onClick={() => {
            if (shouldShowImage) {
              handleLabelSelection(
                label.conditionLabel,
                label.priceDrop,
                label.operation
              );
            }
            if (conditionName.includes("Screen Size")) {
              // console.log("Screen Size");
              dispatch(
                addScreenSize({
                  conditionLabel: label.conditionLabel,
                  priceDrop: label.priceDrop,
                  operation: label.operation,
                })
              );
            } else if (conditionName.includes("Graphic")) {
              // console.log("Graphic");
              dispatch(
                addGraphic({
                  conditionLabel: label.conditionLabel,
                  priceDrop: label.priceDrop,
                  operation: label.operation,
                })
              );
            }
          }}
        >
          {shouldShowImage && label.conditionLabelImg && (
            <div className="p-4">
              <img
                src={`${import.meta.env.VITE_APP_BASE_URL}${
                  label.conditionLabelImg
                }`}
                alt="LabelImg"
                className="size-20 max-sm:size-24"
              />
            </div>
          )}

          <div
            key={label.conditonLabelId}
            className={`${
              deductionData.some(
                (condLabel) => condLabel.conditionLabel == label.conditionLabel
              )
                ? `bg-cyan-500 ${
                    shouldShowImage ? "text-white " : "text-black"
                  } `
                : "bg-slate-100"
            } 
            ${
              shouldShowImage
                ? "py-2 text-center w-full h-[100px] flex items-center justify-center lg:text-[13px] max-md:text-[12px] max-sm:text-sm"
                : "flex text-sm items-center gap-1 py-4 bg-white "
            }
            `}
          >
            {!shouldShowImage ? (
              <>
                <span
                  className={`${
                    deductionData.some(
                      (condLabel) =>
                        condLabel.conditionLabel == label.conditionLabel
                    )
                      ? "border-cyan-500"
                      : "border-surface-dark"
                  } border border-solid rounded-full w-5 h-5 mr-1.5`}
                ></span>
              </>
            ) : null}
            {label.conditionLabel}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeductionItems;