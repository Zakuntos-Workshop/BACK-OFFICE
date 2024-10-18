import React from "react";
import TransactionTable from "components/Tables/TransactionTable";

export default function TransactionsView() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <TransactionTable /> 
        </div>
      </div> 
    </>
  );
}
  