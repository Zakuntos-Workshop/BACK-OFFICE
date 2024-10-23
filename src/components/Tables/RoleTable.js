import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import API from "api/API";
import GlobalStyles from "../Style/GlobalTableStyle.css";
import { Link } from "react-router-dom"; 

export default function RoleTable({ color }) {
  const api = new API();

  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [field, setField] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [isDataLoad, setIsDataLoad] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [permission, setPermission] = useState(null);

  const getRoles = async (page, per_page, keyword, field) => {
    setIsDataLoad(true);
    let response;
    if (isSearch) {
      response = await api.getData(
        `roles?page=${page}&per_page=${per_page}&keyword=${keyword}&field=${field}`
      );
    } else {
      response = await api.getData(`roles?page=${page}&per_page=${per_page}`);
    }
    setRoles(response.data);
    setTotalPages(response.total_pages);
    setIsDataLoad(false);
  };

  const search = async (e) => {
    e.preventDefault();
    const newKeyword = e.target["keyword"].value;
    const newField = e.target["field"].value;
    setKeyword(newKeyword);
    setField(newField);
    setIsSearch(true);
    await getRoles(page, perPage, newKeyword, newField);
  };

  const cancelSearch = () => {
    setIsSearch(false);
    setKeyword("");
    setField("");
    getRoles(page, perPage, "", "");
  };

  useEffect(() => {
    getRoles(page, perPage, keyword, field);
  }, [page, perPage, keyword, field]);

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                Les Rôles et Permissions
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Nom
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Description
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Action
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Permissions
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {role.name}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {role.description}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <TableDropdown />
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <Link
                      to={`/admin/permissions/${role.id}`} 
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Voir les permissions
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

RoleTable.propTypes = {
  color: PropTypes.string,
};
