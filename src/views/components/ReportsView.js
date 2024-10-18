import React from "react";
import ReportTable from "components/Tables/ReportTable";
import TransactionsView from "./TransactionsView";
import TransactionTable from "components/Tables/TransactionTable";

export default function ReportsView() {
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
