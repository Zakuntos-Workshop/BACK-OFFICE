import React from "react";
import InstitutionTable from "components/Tables/InstitutionTable";

export default function InstitutionsView() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <InstitutionTable /> 
        </div>
      </div>
    </>
  );
}
