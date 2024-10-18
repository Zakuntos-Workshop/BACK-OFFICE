import CityTable from "components/Tables/CityTable";
import React from "react";

export default function CitiesView() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CityTable />
        </div>
      </div>
    </>
  );
}
