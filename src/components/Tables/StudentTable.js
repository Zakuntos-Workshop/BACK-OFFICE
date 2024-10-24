import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import API from "api/API";
import "../Style/GlobalTableStyle.css"; 

export default function StudentTable({ color }) {
  const api = new API();

  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalIdDelete, setModalIdDelete] = useState(null);
  const [field, setField] = useState(undefined);
  const [keyword, setKeyword] = useState(undefined);
  const [isSearch, setIsSearch] = useState(false);
  const [isDataLoad, setIsDataLoad] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [permission, setPermission] = useState(null);

  const loadPermission = async (url) => {
    const perm = await api.permission(url);
    setPermission(perm);
  };

  const getStudents = async (page, per_page, keyword, field) => {
    setIsDataLoad(true);
    let response;
    if (isSearch) {
      response = await api.getData(
        `students?page=${page}&per_page=${per_page}&keyword=${keyword}&field=${field}`
      );
    } else {
      response = await api.getData(
        `students?page=${page}&per_page=${per_page}`
      );
    }
    setStudents(response.data);
    setTotalPages(Math.ceil(response.total / perPage));
    setIsDataLoad(false);
  };

  const removeStudent = async (student_id) => {
    await api.send({}, `students/${student_id}`, "DELETE");
    await getStudents(page, perPage, keyword, field);
    setModalIdDelete(null);
  };

  const cancelSearch = () => {
    setIsSearch(false);
    setKeyword(null);
    setField(null);
    getStudents(page, perPage, null, null);
  };

  const search = async (e) => {
    e.preventDefault();
    const newKeyword = e.target["keyword"].value;
    const newField = e.target["field"].value;
    setKeyword(newKeyword);
    setField(newField);
    setIsSearch(true);
    await getStudents(page, perPage, newKeyword, newField);
  };

  useEffect(() => {
    getStudents(page, perPage, keyword, field);
    loadPermission("/students");
  }, [page, perPage, keyword, field]);

  console.log(students)

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
                Les Étudiants
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="global-table">
            <thead>
              <tr>
                <th className="global-header">Nom</th>
                <th className="global-header">Client</th>
                <th className="global-header">Genre</th>
                <th className="global-header">Date de création</th>
                <th className="global-header">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="global-row">
                  <td className="global-cell">{student.full_name}</td>
                  <td className="global-cell">{student.user.full_name}</td>
                  <td className="global-cell">{student.gender}</td>
                  <td className="global-cell">{student.created_at}</td>
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

StudentTable.propTypes = {
  color: PropTypes.string,
};
