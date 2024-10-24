import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import API from "api/API";
import moment from "moment"; // Pour formater la date
import '../Style/GlobalTableStyle.css'; // Import du style global

export default function CurrencyTable({ color }) {
  const api = new API();

  const [currencies, setCurrencies] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalIdOpen, setModalIdOpen] = useState(null);
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

  const getCurrencies = async (page, per_page, keyword, field) => {
    setIsDataLoad(true);
    let response;
    if (isSearch) {
      response = await api.getData(
        `currencies?page=${page}&per_page=${per_page}&keyword=${keyword}&field=${field}`
      );
    } else {
      response = await api.getData(
        `currencies?page=${page}&per_page=${per_page}`
      );
    }
    setCurrencies(response.data);
    setIsDataLoad(false);
  };

  const removeCurrency = async (currency_id) => {
    await api.send({}, `currencies/${currency_id}`, "DELETE");
    await getCurrencies(page, perPage, keyword, field);
    setModalIdDelete(null);
  };

  const cancelSearch = () => {
    setIsSearch(false);
    setKeyword(null);
    setField(null);
    getCurrencies(page, perPage, null, null);
  };

  const search = async (e) => {
    e.preventDefault();
    const newKeyword = e.target["keyword"].value;
    const newField = e.target["field"].value;
    setKeyword(newKeyword);
    setField(newField);
    setIsSearch(true);
    await getCurrencies(page, perPage, newKeyword, newField);
  };

  useEffect(() => {
    getCurrencies(page, perPage, keyword, field);
    loadPermission("/currencies");
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
              Les Devises
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
                  <th className="global-header">Date de création</th>
                  <th className="global-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {currencies?.map((currency, index) => (
                  <tr key={index} className="global-row">
                    <td className="global-cell">{currency.name}</td>
                    <td className="global-cell">{currency.description}</td>
                    <td className="global-cell">
                      {currency.created_at}
                    </td>
                    <td className="global-cell text-right">
                      <button className="global-button">Modifier</button>
                      <button className="global-button ml-2">Supprimer</button>
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
            Page {page}
          </span>
          <button
            disabled={currencies.length < perPage}
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

CurrencyTable.propTypes = {
  color: PropTypes.string,
};
