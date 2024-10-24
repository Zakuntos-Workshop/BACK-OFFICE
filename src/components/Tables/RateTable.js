import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import API from "api/API";
import moment from "moment";
import '../Style/GlobalTableStyle.css';  // Ajout du fichier de style

export default function RateTable({ color }) {
  const api = new API();

  const [rates, setRates] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isDataLoad, setIsDataLoad] = useState(false);
  const [keyword, setKeyword] = useState(undefined);
  const [field, setField] = useState(undefined);
  const [isSearch, setIsSearch] = useState(false);
  const [modalIdDelete, setModalIdDelete] = useState(null);

  const getRates = async (page, per_page, keyword, field) => {
    setIsDataLoad(true);
    let response;
    if (isSearch) {
      response = await api.getData(
        `rates?page=${page}&per_page=${per_page}&keyword=${keyword}&field=${field}`
      );
    } else {
      response = await api.getData(`rates?page=${page}&per_page=${per_page}`);
    }
    setRates(response.data);
    setIsDataLoad(false);
  };

  const removeRate = async (rate_id) => {
    await api.send({}, `rates/${rate_id}`, "DELETE");
    await getRates(page, perPage, keyword, field);
    setModalIdDelete(null);
  };

  const cancelSearch = () => {
    setIsSearch(false);
    setKeyword(null);
    setField(null);
    getRates(page, perPage, null, null);
  };

  const search = async (e) => {
    e.preventDefault();
    const newKeyword = e.target["keyword"].value;
    const newField = e.target["field"].value;
    setKeyword(newKeyword);
    setField(newField);
    setIsSearch(true);
    await getRates(page, perPage, newKeyword, newField);
  };

  useEffect(() => {
    getRates(page, perPage, keyword, field);
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
              Le Taux
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
                  <option value="from_currency">Devise de depart</option>
                  <option value="to_currency">Devise de conversion</option>
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
                  <th className="global-header">Devise de départ</th>
                  <th className="global-header">Devise de conversion</th>
                  <th className="global-header">Taux de conversion</th>
                  <th className="global-header">Taux par défaut</th>
                  <th className="global-header">Date de création</th>
                  <th className="global-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {rates?.map((rate, index) => (
                  <tr key={index} className="global-row">
                    <td className="global-cell">{rate.currency.name}</td>
                    <td className="global-cell">{rate.currencyTo.name}</td>
                    <td className="global-cell">{rate.amount}</td>
                    <td className="global-cell">
                      {rate.is_default ? "Oui" : "Non"}
                    </td>
                    <td className="global-cell">
                      {rate.created_at}
                    </td>
                    <td className="global-cell text-right">
                      <TableDropdown />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

RateTable.propTypes = {
  color: PropTypes.string,
};
