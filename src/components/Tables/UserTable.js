import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import API from "api/API";
import '../Style/GlobalTableStyle.css'; 

export default function UserTable({ color }) {
  const api = new API();
  
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isDataLoad, setIsDataLoad] = useState(false);
  const [keyword, setKeyword] = useState(undefined);
  const [field, setField] = useState(undefined);
  const [isSearch, setIsSearch] = useState(false);
  const [modalIdDelete, setModalIdDelete] = useState(null);
  
  const getUsers = async (page, per_page, keyword, field) => {
    setIsDataLoad(true);
    let response;
    if (isSearch) {
      response = await api.getData(`users?page=${page}&per_page=${per_page}&keyword=${keyword}&field=${field}`);
    } else {
      response = await api.getData(`users?page=${page}&per_page=${per_page}`);
    }
    setUsers(response.data);
    setTotalPages(Math.ceil(response.total / perPage)); 
    setIsDataLoad(false);
  };
  
  const removeUser = async (user_id) => {
    await api.send({}, `users/${user_id}`, "DELETE");
    await getUsers(page, perPage, keyword, field); 
    setModalIdDelete(null);
  };
  
  const cancelSearch = () => {
    setIsSearch(false);
    setKeyword(null);
    setField(null);
    getUsers(page, perPage, null, null);
  };

  const search = async (e) => {
    e.preventDefault();
    const newKeyword = e.target["keyword"].value;
    const newField = e.target["field"].value;
    setKeyword(newKeyword);
    setField(newField);
    setIsSearch(true);
    await getUsers(page, perPage, newKeyword, newField);
  };

  useEffect(() => {
    getUsers(page, perPage, keyword, field);
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
              Les Utilisateurs
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
                  <option value="full_name">Nom</option>
                  <option value="email">Email</option>
                </select>
                <button
                  type="submit"
                  className="ml-2 bg-blue-500 text-white px-4 py-1 rounded"
                >
                  Rechercher
                </button>
              </form>
              <button
                onClick={cancelSearch}
                className="bg-gray-500 text-white px-4 py-1 rounded"
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
                  <th className="global-header">Rôle</th>
                  <th className="global-header">Email</th>
                  <th className="global-header">Téléphone</th>
                  <th className="global-header">Institution</th>
                  <th className="global-header">Date de création</th>
                  <th className="global-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user, index) => (
                  <tr key={index} className="global-row">
                    <td className="global-cell"><img
                        src={user.logo}
                        alt={user.full_name}
                        className="h-12 w-12 rounded-full border"
                      /></td>
                    <td className="global-cell">{user.full_name}</td>
                    <td className="global-cell">{user.role.name}</td>
                    <td className="global-cell">{user.email}</td>
                    <td className="global-cell">{user.phone}</td>
                    <td className="global-cell">
                      {user.institution?.name || "Non assignée"}
                    </td>
                    <td className="global-cell">{user.created_at}</td>
                    <td className="global-cell text-right">
                      <TableDropdown />
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
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Précédent
          </button>
          <span>
            Page {page} sur {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Suivant
          </button>
        </div>
      </div>
    </>
  );
}

UserTable.propTypes = {
  color: PropTypes.string,
};
