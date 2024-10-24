import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import API from "api/API";
import '../Style/GlobalTableStyle.css'; // Import du style global
import moment from "moment"; // Pour formater la date

export default function FeatureTable({ color }) {
  const api = new API();

  const [features, setFeatures] = useState([]);
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

  const getFeatures = async (page, per_page, keyword, field) => {
    setIsDataLoad(true);
    let response;
    if (isSearch) {
      response = await api.getData(
        `features?page=${page}&per_page=${per_page}&keyword=${keyword}&field=${field}`
      );
    } else {
      response = await api.getData(`features?page=${page}&per_page=${per_page}`);
    }
    setFeatures(response.data);
    setIsDataLoad(false);
  };

  const removeFeature = async (feature_id) => {
    await api.send({}, `features/${feature_id}`, "DELETE");
    await getFeatures(page, perPage, keyword, field);
    setModalIdDelete(null);
  };

  const cancelSearch = () => {
    setIsSearch(false);
    setKeyword(null);
    setField(null);
    getFeatures(page, perPage, null, null);
  };

  const search = async (e) => {
    e.preventDefault();
    const newKeyword = e.target["keyword"].value;
    const newField = e.target["field"].value;
    setKeyword(newKeyword);
    setField(newField);
    setIsSearch(true);
    await getFeatures(page, perPage, newKeyword, newField);
  };

  useEffect(() => {
    getFeatures(page, perPage, keyword, field);
    loadPermission("/features");
  }, [page, perPage, keyword, field]);

  return (
    <>
      <div
        className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${
          color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"
        }`}
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex justify-between items-center">
            <h3
              className={`font-semibold text-lg ${
                color === "light" ? "text-blueGray-700" : "text-white"
              }`}
            >
              Les Fonctionnalités
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
                  <option value="url">Url</option>
                </select>
                <button type="submit" className="ml-2 global-button">
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
                  <th className="global-header">Url</th>
                  <th className="global-header">Date de création</th>
                  <th className="global-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="global-row">
                    <td className="global-cell">{feature.name}</td>
                    <td className="global-cell">{feature.url}</td>
                    <td className="global-cell">
                      {feature.created_at}
                    </td>
                    <td className="global-cell text-right">
                      <button className="global-button" onClick={() => setModalIdOpen(feature.id)}>Modifier</button>
                      <button
                        className="global-button ml-2"
                        onClick={() => setModalIdDelete(feature.id)}
                      >
                        Supprimer
                      </button>
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
          <span>Page {page}</span>
          <button
            disabled={features.length < perPage}
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

FeatureTable.propTypes = {
  color: PropTypes.string,
};
