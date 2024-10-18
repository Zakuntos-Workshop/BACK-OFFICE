import React from "react";
import FeatureTable from "components/Tables/FeatureTable";

export default function FeaturesView() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <FeatureTable />
        </div>
      </div>
    </>
  );
}
