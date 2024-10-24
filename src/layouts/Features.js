import React from "react"; 
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import Dashboard from "views/components/Dashboard.js";
import FeaturesView from "views/components/FeaturesView";

export default function Features() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <FeaturesView />
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}



