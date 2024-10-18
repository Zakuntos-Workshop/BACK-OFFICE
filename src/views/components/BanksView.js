import BankTable from "components/Tables/BankTable";
import React from "react";

export default function BanksView() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <BankTable />
        </div>
      </div>
    </>
  );
}
