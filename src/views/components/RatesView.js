import RateTable from "components/Tables/RateTable";
import React from "react";

export default function RatesView() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <RateTable />
        </div>
      </div>
    </>
  );
}
