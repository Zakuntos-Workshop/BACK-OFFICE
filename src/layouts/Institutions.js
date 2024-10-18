import React from "react"; 
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import InstitutionsView from "views/components/InstitutionsView";

export default function Admin() { 
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <InstitutionsView />
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}



