import React, { useState, useEffect } from "react";
import API from "api/API";
import '../Style/GlobalTableStyle.css';  
import moment from "moment";

export default function FeesTable({ color }) {
  const api = new API();

  const [fees, setFees] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isDataLoad, setIsDataLoad] = useState(false);
  const [keyword, setKeyword] = useState(undefined);
  const [field, setField] = useState(undefined);
  const [isSearch, setIsSearch] = useState(false);

  const getFees = async (page, per_page, keyword, field) => {
    setIsDataLoad(true);
    let response;
    if (isSearch) {
      response = await api.getData(`transaction_fees?page=${page}&per_page=${per_page}&keyword=${keyword}&field=${field}`);
    } else {
      response = await api.getData(`transaction_fees?page=${page}&per_page=${per_page}`);
    }
    setFees(response.data);
    setTotalPages(Math.ceil(response.total / perPage));
    setIsDataLoad(false);
  };
  console.log(fees)

  const cancelSearch = () => {
    setIsSearch(false);
    setKeyword(null);
    setField(null);
    getFees(page, perPage, null, null);
  };

  const search = async (e) => {
    e.preventDefault();
    const newKeyword = e.target["keyword"].value;
    const newField = e.target["field"].value;
    setKeyword(newKeyword);
    setField(newField);
    setIsSearch(true);
    await getFees(page, perPage, newKeyword, newField);
  };

  useEffect(() => {
    getFees(page, perPage, keyword, field);
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
              Les Frais
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
                  <option value="amount">Montant</option>
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
                  <th className="global-header">Pourcentage</th>
                  <th className="global-header">Date de création</th>
                  <th className="global-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {fees?.map((fee, index) => (
                  <tr key={index} className="global-row">
                    <td className="global-cell">{fee.payMode.name}</td>
                    <td className="global-cell">{fee.percentage}</td>
                    <td className="global-cell">
                    {moment(fee.created_at).format("DD MMMM YYYY")} 
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
            Page {page} sur {totalPages}
          </span>
          <button
            disabled={page === totalPages}
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
