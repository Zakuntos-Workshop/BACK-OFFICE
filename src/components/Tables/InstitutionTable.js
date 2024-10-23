import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import API from "api/API";
import '../Style/GlobalTableStyle.css'

export default function InstitutionTable({ color }) {
  const api = new API();

  const [institutions, setInstitutions] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isDataLoad, setIsDataLoad] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState(undefined);
  const [field, setField] = useState(undefined);
  const [isSearch, setIsSearch] = useState(false);

  const getInstitutions = async (page, per_page, keyword, field) => {
    setIsDataLoad(true);
    let response;
    if (isSearch) {
      response = await api.getData(
        `institutions?page=${page}&per_page=${per_page}&keyword=${keyword}&field=${field}`
      );
    } else {
      response = await api.getData(
        `institutions?page=${page}&per_page=${per_page}`
      );
    }
    setInstitutions(response.data);
    setTotalPages(Math.ceil(response.total / perPage));
    setIsDataLoad(false);
  };

  useEffect(() => {
    getInstitutions(page, perPage, keyword, field);
  }, [page, perPage, keyword, field]);

  const formatAddress = (address) => {
    if (!address) return "Adresse non disponible";
    const { number, street, district, city } = address;
    return `${number ? number + " " : ""}${street ? street + ", " : ""}${district ? district + ", " : ""}${city ? city.name : ""}`;
  };

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
                Les Institutions
              </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="text-black bg-gray-200"
              >
                <option value={10}>10 par page</option>
                <option value={20}>20 par page</option>
                <option value={50}>50 par page</option>
              </select>
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
                  <th className="global-header">Logo</th>
                  <th className="global-header">Nom</th>
                  <th className="global-header">Catégorie</th>
                  <th className="global-header">Description</th>
                  <th className="global-header">Adresse</th>
                  <th className="global-header">Statut</th>
                  <th className="global-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {institutions.map((institution, index) => (
                  <tr key={index} className="global-row">
                    <td className="global-cell">
                      <img
                        src={institution.logo}
                        alt={institution.name}
                        className="h-12 w-12 rounded-full border"
                      />
                    </td> 
                    <td className="global-cell">
                      <Link
                        to={`/institutions/${institution.id}`}
                        className="text-blue-500 underline"
                      >
                        {institution.name}
                      </Link>
                    </td>
                    <td className="global-cell">
                      {institution.category ? institution.category.name : "N/A"}
                    </td>
                    <td className="global-cell">
                      {institution.description || "Pas de description"}
                    </td>
                    <td className="global-cell">
                      {formatAddress(institution.address)}
                    </td>
                    <td className="global-cell">
                      {institution.status === 1 ? (
                        <span className="text-green-500">Actif</span>
                      ) : (
                        <span className="text-red-500">Inactif</span>
                      )}
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

InstitutionTable.propTypes = {
  color: PropTypes.string,
};
