import React, { useState, useEffect } from "react";
import API from "api/API";

export default function CardSocialTraffic() {
  const [transactions, setTransactions] = useState([]);
  const api = new API();

  const getTransactions = async (page, per_page) => {
    const transactionsData = await api.getData(`transactions?page=${page}&per_page=${per_page}`);
    setTransactions(transactionsData.data || []);
    console.log(transactionsData);
  };

  useEffect(() => {
    getTransactions(1, 5000);
  }, []);

  const groupByInstitution = (transactions) => {
    return transactions.reduce((acc, transaction) => {
      const institutionName = transaction.institution?.name || "Inconnu"; 
      const total = Number(transaction.total) || 0; 
      if (!acc[institutionName]) {
        acc[institutionName] = 0;
      }
      acc[institutionName] += total; 
      return acc;
    }, {});
  };

  const transactionsByInstitution = groupByInstitution(transactions);
  const totalTransactions = Object.values(transactionsByInstitution).reduce((sum, total) => sum + total, 0);

  console.log(transactionsByInstitution);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-blueGray-700">
                Transactions par institution
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead className="thead-light">
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Institution
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Transactions
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                  Pourcentage
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(transactionsByInstitution).map(([institution, total]) => {
                const percentage = totalTransactions > 0 ? ((total / totalTransactions) * 100).toFixed(2) : 0;
                return (
                  <tr key={institution}>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      {institution}
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {total}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <span className="mr-2">{percentage}%</span>
                        <div className="relative w-full">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                            <div
                              style={{ width: `${percentage}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
