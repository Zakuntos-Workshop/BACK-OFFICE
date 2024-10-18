import React from "react";
import UserTable from "components/Tables/UserTable";

export default function UsersView() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <UserTable />
        </div>
      </div>
    </>
  );
}
