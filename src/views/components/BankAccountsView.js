import React from "react";
import BankAccountTable from "components/Tables/BankAccountTable";

export default function BankAccountsView() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <BankAccountTable />
        </div>
      </div>
    </>
  );
}
