import RoleTable from "components/Tables/RoleTable";
import React from "react";


export default function RolesView() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <RoleTable />
        </div>
      </div>
    </>
  );
}