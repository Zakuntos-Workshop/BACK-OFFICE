import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import API from "api/API";

export default function FeesTable({ color }) {
  const api = new API();

  const [  , setFees] = useState([]);
  const [categories, setCategories] = useState([]);
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

  const getFees = async (page, per_page, keyword, field) => {
    setIsDataLoad(true);
    let response;
    if (isSearch) {
      response = await api.getData(
        `fees?page=${page}&per_page=${per_page}&keyword=${keyword}&field=${field}`
      );
    } else {
      response = await api.getData(
        `fees?page=${page}&per_page=${per_page}`
      );
    }
    setFees(response.data);
    setIsDataLoad(false);
  };

  const removeFees = async (fees_id) => {
    await api.send({}, `fees/${fees_id}`, "DELETE");
    await getFees(page, perPage, keyword, field);
    setModalIdDelete(null);
  };

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
    loadPermission("/fees");
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
                Les Frais
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Mode de paiement
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Pourcentage
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Date de creation
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Action
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </>
  );
}

FeesTable.propTypes = {
  color: PropTypes.string,
};
