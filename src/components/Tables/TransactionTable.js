import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom"; 
import { format } from "date-fns"; 
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import API from "api/API";
import '../Style/TransactionTable.css';

export default function TransactionTable({ color }) {
  const api = new API();

  const [transactions, setTransactions] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const getTransactions = async () => {
    setIsLoading(true);
    const response = await api.getData(`transactions?page=${page}&per_page=${perPage}`);
    setTransactions(response.data);
    setTotalPages(Math.ceil(response.total / perPage));
    setIsLoading(false);
  };

  useEffect(() => {
    getTransactions();
  }, [page, perPage]);

  return (
    <>
      <div className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}>
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className={`font-semibold text-sm ${color === "light" ? "text-blueGray-700" : "text-white"}`}>
                Les Transactions
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
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="loader" />
            </div>
          ) : (
            <table className="transaction-table">
              <thead>
                <tr>
                  <th className="transaction-header">No</th>
                  <th className="transaction-header">Client</th>
                  <th className="transaction-header">Etudiant</th>
                  <th className="transaction-header">Promotion</th>
                  <th className="transaction-header">Mode de Paiement</th>
                  <th className="transaction-header">Montant</th>
                  <th className="transaction-header">Institution</th>
                  <th className="transaction-header">Motif de paiement</th>
                  <th className="transaction-header">Statut de paiement</th>
                  <th className="transaction-header">Date de Paiement</th>
                  <th className="transaction-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions?.map((transaction, index) => (
                  <tr key={index} className="transaction-row">
                    <td className="transaction-cell">{transaction.number}</td>
                    <td className="transaction-cell">
                      <Link to={`/clients/${transaction.user.id}`} className="text-blue-500 underline">{transaction.user.full_name}</Link>
                    </td>
                    <td className="transaction-cell">
                      <Link to={`/etudiants/${transaction.student.id}`} className="text-blue-500 underline">{transaction.student.full_name}</Link>
                    </td>
                    <td className="transaction-cell">{transaction.promotion}</td>
                    <td className="transaction-cell">{`${transaction.user_pay_mode.pay_mode.name} - ${transaction.user_pay_mode.number}`}</td>
                    <td className="transaction-cell">{`${transaction.amount} ${transaction.bank_account.currency.name}`}</td>
                    <td className="transaction-cell">
                      <Link to={`/institutions/${transaction.institution.id}`} className="text-blue-500 underline">{transaction.institution.name}</Link>
                    </td>
                    <td className="transaction-cell">{transaction.description}</td>
                    <td className="transaction-cell">
                      <span className={transaction.status === 0 ? "text-red-500" : "text-green-500"}>
                        {transaction.status === 0 ? "En Attente" : "Reussi"}
                      </span>
                    </td>
                    <td className="transaction-cell">
                      {/* Formater la date et l'heure ici */}
                      {format(new Date(transaction.created_at), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="transaction-cell text-right">
                      <TableDropdown />
                      <button className="bg-blue-500 text-white px-2 py-1 rounded">Voir Détails</button>
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

TransactionTable.propTypes = {
  color: PropTypes.string,
};
