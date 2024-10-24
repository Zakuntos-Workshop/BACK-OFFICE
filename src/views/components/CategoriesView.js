import React from "react";
import CurrencyTable from "components/Tables/CurrencyTable";
import CategoryTable from "components/Tables/CategoryTable";

export default function CategoriesView() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CategoryTable />
        </div>
      </div>
    </>
  );
}
