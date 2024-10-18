import React from "react";
import FeesTable from "components/Tables/FeesTable";

export default function FeesView() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <FeesTable />
        </div>
      </div>
    </>
  );
}
