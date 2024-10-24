import React, { useState, useEffect } from "react";
import API from "api/API";
import '../Style/GlobalTableStyle.css';  
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import moment from "moment";

export default function CityTable({ color }) {
  const api = new API();

  const [cities, setCities] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isDataLoad, setIsDataLoad] = useState(false);

  const getCities = async (page, per_page) => {
    setIsDataLoad(true);
    const response = await api.getData(`cities?page=${page}&per_page=${per_page}`);
    setCities(response.data);
    setTotalPages(Math.ceil(response.total / perPage)); 
    setIsDataLoad(false);
  };

  useEffect(() => {
    getCities(page, perPage);
  }, [page, perPage]);

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
              Les Villes
            </h3>
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
                  <th className="global-header">Province</th>
                  <th className="global-header">Date de création</th>
                  <th className="global-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city, index) => (
                  <tr key={index} className="global-row">
                    <td className="global-cell">{city.name}</td>
                    <td className="global-cell">{city.province}</td>
                    <td className="global-cell">
                      {city.created_at}
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
