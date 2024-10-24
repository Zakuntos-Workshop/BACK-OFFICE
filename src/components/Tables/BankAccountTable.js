import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import API from "api/API";
import moment from "moment"; // Pour formater la date
import '../Style/GlobalTableStyle.css'; // Import du style global

export default function BankAccountTable({ color }) {
  const api = new API();

  const [bankAccounts, setBankAccounts] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0); // Pour le nombre total de pages
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

  const getBankAccounts = async (page, per_page, keyword, field) => {
    setIsDataLoad(true);
    let response;
    if (isSearch) {
      response = await api.getData(
        `bank_accounts?page=${page}&per_page=${per_page}&keyword=${keyword}&field=${field}`
      );
    } else {
      response = await api.getData(
        `bank_accounts?page=${page}&per_page=${per_page}`
      );
    }
    setBankAccounts(response.data);
    setTotalPages(Math.ceil(response.total / perPage)); // Pour calculer le nombre total de pages
    setIsDataLoad(false);
  };

  const removeBankAccount = async (bankAccount_id) => {
    await api.send({}, `bank_accounts/${bankAccount_id}`, "DELETE");
    await getBankAccounts(page, perPage, keyword, field);
    setModalIdDelete(null);
  };

  const cancelSearch = () => {
    setIsSearch(false);
    setKeyword(null);
    setField(null);
    getBankAccounts(page, perPage, null, null);
  };

  const search = async (e) => {
    e.preventDefault();
    const newKeyword = e.target["keyword"].value;
    const newField = e.target["field"].value;
    setKeyword(newKeyword);
    setField(newField);
    setIsSearch(true);
    await getBankAccounts(page, perPage, newKeyword, newField);
  };

  useEffect(() => {
    getBankAccounts(page, perPage, keyword, field);
    loadPermission("/bank_accounts");
  }, [page, perPage, keyword, field]);

  console.log(bankAccounts)

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
              Les Comptes Bancaires
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
                  <option value="name">Nom de la banque</option>
                  <option value="accountNumber">Numéro du compte</option>
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
                  <th className="global-header">Institution</th>
                  <th className="global-header">Banque</th>
                  <th className="global-header">Intitulé du compte</th>
                  <th className="global-header">Numéro du compte</th>
                  <th className="global-header">Description</th>
                  <th className="global-header">Date de création</th>
                  <th className="global-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {bankAccounts?.map((account, index) => (
                  <tr key={index} className="global-row">
                    <td className="global-cell">{account.institution.name}</td>
                    <td className="global-cell">{account.bank.name}</td>
                    <td className="global-cell">{account.bank.description}</td>
                    <td className="global-cell">{account.number}</td>
                    <td className="global-cell">{account.description}</td>
                    <td className="global-cell">
                      {account.created_at}
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

BankAccountTable.propTypes = {
  color: PropTypes.string,
};
