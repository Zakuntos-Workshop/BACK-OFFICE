import React from "react";
import CurrencyTable from "components/Tables/CurrencyTable";

export default function CurrenciesView() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CurrencyTable />
        </div>
      </div>
    </>
  );
}
