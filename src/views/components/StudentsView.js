import StudentTable from "components/Tables/StudentTable";
import React from "react";

export default function StudentsView() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <StudentTable />
        </div>
      </div>
    </>
  );
}
