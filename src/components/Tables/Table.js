import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import API from "api/API";

export default function InstitutionTable({ color }) {
  const api = new API();

  const [institutions, setInstitutions] = useState([]);
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
    setIsDataLoad(false);
  };

  const removeInstitution = async (institution_id) => {
    await api.send({}, `institutions/${institution_id}`, "DELETE");
    await getInstitutions(page, perPage, keyword, field);
    setModalIdDelete(null);
  };

  const cancelSearch = () => {
    setIsSearch(false);
    setKeyword(null);
    setField(null);
    getInstitutions(page, perPage, null, null);
  };

  const search = async (e) => {
    e.preventDefault();
    const newKeyword = e.target["keyword"].value;
    const newField = e.target["field"].value;
    setKeyword(newKeyword);
    setField(newField);
    setIsSearch(true);
    await getInstitutions(page, perPage, newKeyword, newField);
  };

  useEffect(() => {
    getInstitutions(page, perPage, keyword, field);
    loadPermission("/institutions");
  }, [page, perPage, keyword, field]);

console.log(institutions)

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
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Logo
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Nom
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Catégorie
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Description
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Adresse
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Statut
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Action
                </th>
              </tr>
            </thead>
            {/* <tbody>
              {institutions?.map((institution, index) => (
                <tr key={index}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                    <img
                      src={institution.logo}
                      className="h-12 w-12 bg-white rounded-full border"
                      alt={institution.name}
                    />
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {institution.name}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {institution.category}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {institution.description}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {institution.address}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {institution.status}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                    <TableDropdown />
                  </td>
                </tr>
              ))}
            </tbody> */}
          </table>
        </div>
      </div>
    </>
  );
}

InstitutionTable.propTypes = {
  color: PropTypes.string,
};
