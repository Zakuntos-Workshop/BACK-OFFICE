import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import API from "api/API";
import '../Style/GlobalTableStyle.css'; // Import du style global
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
          <div className="flex justify-between items-center">
            <h3
              className={
                "font-semibold text-lg " +
                (color === "light" ? "text-blueGray-700" : "text-white")
              }
            >
              Les Rôles et Permissions
            </h3>
            <div className="flex items-center">
              <form onSubmit={search} className="mr-4">
                <input
                  type="text"
                  name="keyword"
                  placeholder="Rechercher..."
                  className="border rounded px-2 py-1 text-sm"
                />
                <select
                  name="field"
                  className="ml-2 border rounded px-2 py-1 text-sm"
                >
                  <option value="name">Nom</option>
                  <option value="description">Description</option>
                </select>
                <button
                  type="submit"
                  className="ml-2 global-button"
                >
                  Rechercher
                </button>
              </form>
              <button
                onClick={cancelSearch}
                className="global-button bg-gray-500 text-white"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {isDataLoad ? (
            <div className="flex justify-center items-center h-48">
              <div className="loader" />
            </div>
          ) : (
            <table className="global-table">
              <thead>
                <tr>
                  <th className="global-header">Nom</th>
                  <th className="global-header">Description</th>
                  <th className="global-header">Action</th>
                  <th className="global-header">Permissions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="global-row">
                    <td className="global-cell">{role.name}</td>
                    <td className="global-cell">{role.description}</td>
                    <td className="global-cell text-right">
                      <TableDropdown />
                    </td>
                    <td className="global-cell text-right">
                      <Link
                        to={`/admin/permissions/${role.id}`} 
                        className="global-button"
                      >
                        Voir les permissions
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex justify-between items-center p-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="global-button"
          >
            Précédent
          </button>
          <span>
            Page {page} sur {totalPages}
          </span>
          <button
            disabled={roles.length < perPage}
            onClick={() => setPage(page + 1)}
            className="global-button"
          >
            Suivant
          </button>
        </div>
      </div>
    </>
  );
}

RoleTable.propTypes = {
  color: PropTypes.string,
};
