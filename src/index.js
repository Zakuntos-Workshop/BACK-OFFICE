import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

import Admin from "layouts/Admin";
import Auth from "layouts/Auth";
import Register from "views/auth/Register";
import MapLayout from "layouts/MapLayout";
import SettingLayout from "layouts/SettingLayout";
import TableLayout from "layouts/TableLayout";
import Store from "./store/configStore"
import Transactions from "layouts/Transactions";
import Users from "layouts/Users";
import Institutions from "layouts/Institutions";
import Reports from "layouts/Reports";
import Students from "layouts/Students";
import Banks from "layouts/Banks";
import Roles from "layouts/Roles";
import Fees from "layouts/Fees";
import Rates from "layouts/Rates";
import Cities from "layouts/Cities";
import Features from "layouts/Features";
import BankAccounts from "layouts/BankAccounts";
import Currencies from "layouts/Currencies";

const queryClient = new QueryClient(); 
const root = createRoot(document.getElementById("root"));
root.render( 
  <QueryClientProvider client={queryClient}> 
    <ReduxProvider store={Store}>  
      <BrowserRouter> 
        <Routes>
          <Route path="/admin/dashboard" element={<Admin />} />
          <Route path="/admin/transactions" element={<Transactions />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/user/:id" element={<Users />} />
          <Route path="/admin/institutions" element={<Institutions />} /> 
          <Route path="/admin/institution/:id" element={<Institutions />} /> 
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/student/:id" element={<Students />} />
          <Route path="/admin/banks" element={<Banks />} />
          <Route path="/admin/roles" element={<Roles />} />
          <Route path="/admin/fees" element={<Fees />} />
          <Route path="/admin/rates" element={<Rates />} />
          <Route path="/admin/cities" element={<Cities />} />
          <Route path="/admin/features" element={<Features />} />
          <Route path="/admin/bank_accounts" element={<BankAccounts />} />
          <Route path="/admin/currencies" element={<Currencies />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/maps" element={<MapLayout />} />
          <Route path="/settings" element={<SettingLayout />} />
          <Route path="/tables" element={<TableLayout />} />
          <Route path="/" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ReduxProvider>
  </QueryClientProvider>
);
