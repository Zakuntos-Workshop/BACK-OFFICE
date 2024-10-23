import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import API from "api/API";
import '../Style/GlobalTableStyle.css'

export default function BankTable({ color }) {
  const api = new API();

  const [banks, setBanks] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [modalIdDelete, setModalIdDelete] = useState(null);
  const [field, setField] = useState(undefined);
  const [keyword, setKeyword] = useState(undefined);
  const [isSearch, setIsSearch] = useState(false);
  const [isDataLoad, setIsDataLoad] = useState(false);
  const [permission, setPermission] = useState(null);

  const loadPermission = async (url) => {
    const perm = await api.permission(url);
    setPermission(perm);
  };

  const getBanks = async (page, per_page, keyword, field) => {
    setIsDataLoad(true);
    let response;
    if (isSearch) {
      response = await api.getData(
        `banks?page=${page}&per_page=${per_page}&keyword=${keyword}&field=${field}`
      );
    } else {
      response = await api.getData(`banks?page=${page}&per_page=${per_page}`);
    }
    setBanks(response.data);
    setTotalPages(Math.ceil(response.total / perPage));
    setIsDataLoad(false);
  };

  const removeBank = async (bank_id) => {
    await api.send({}, `banks/${bank_id}`, "DELETE");
    await getBanks(page, perPage, keyword, field);
    setModalIdDelete(null);
  };

  const cancelSearch = () => {
    setIsSearch(false);
    setKeyword(null);
    setField(null);
    getBanks(page, perPage, null, null);
  };

  const search = async (e) => {
    e.preventDefault();
    const newKeyword = e.target["keyword"].value;
    const newField = e.target["field"].value;
    setKeyword(newKeyword);
    setField(newField);
    setIsSearch(true);
    await getBanks(page, perPage, newKeyword, newField);
  };

  useEffect(() => {
    getBanks(page, perPage, keyword, field);
    loadPermission("/banks");
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
                Les Banques
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="global-table">
            <thead>
              <tr>
                <th className="global-header"></th>
                <th className="global-header">Nom</th>
                <th className="global-header">Catégorie</th>
                <th className="global-header">Description</th>
                <th className="global-header">Date de création</th>
                <th className="global-header">Action</th>
              </tr>
            </thead>
            <tbody>
              {banks.map((bank) => (
                <tr className="global-row" key={bank.id}>
                  <td className="global-cell"><img
                        src={bank.logo}
                        alt={bank.name}
                        className="h-12 w-12 rounded-full border"
                      /></td>
                  <td className="global-cell">{bank.name}</td>
                  <td className="global-cell">{bank.category}</td>
                  <td className="global-cell">{bank.description}</td>
                  <td className="global-cell">{bank.created_at}</td>
                  <td className="global-cell">
                    <TableDropdown />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      </div>
    </>
  );
}

BankTable.propTypes = {
  color: PropTypes.string,
};
