import React from "react"; 
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import Dashboard from "views/components/Dashboard.js";
import BanksView from "views/components/BanksView";

export default function Banks() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <BanksView />
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}



