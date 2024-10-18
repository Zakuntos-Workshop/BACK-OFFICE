import React, { useState, useEffect } from "react";
import CardStats from "components/Tables/CardStats";
import API from "api/API";
import moment from "moment";

export default function HeaderStats() {
  const [students, setStudents] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const api = new API();

  const getStudents = async (page, per_page) => {
    const studentsData = await api.getData(`students?page=${page}&per_page=${per_page}`);
    setStudents(studentsData);
  };

  const getInstitutions = async (page, per_page) => {
    const institutionsData = await api.getData(`institutions?page=${page}&per_page=${per_page}`);
    setInstitutions(institutionsData);
  };

  const getBankAccounts = async (page, per_page) => {
    const bankAccountsData = await api.getData(`bank_accounts?page=${page}&per_page=${per_page}`);
    setBankAccounts(bankAccountsData);
  };

  const getUsers = async (page, per_page) => {
    const usersData = await api.getData(`users?page=${page}&per_page=${per_page}`);
    setUsers(usersData);
  };

  const getTransactions = async (page, per_page) => {
    const transactionsData = await api.getData(`transactions?page=${page}&per_page=${per_page}`);
    setTransactions(transactionsData);
  };

  useEffect(() => {
    getUsers(1, 5);
    getTransactions(1, 5);
    getStudents(1, 5);
    getInstitutions(1, 5);
    getBankAccounts(1, 5);
  }, []);

  const calculateStats = (data, period = 'month') => {
    const thisPeriod = moment().startOf(period);
    const lastPeriod = moment().subtract(1, period).startOf(period);

    const itemsThisPeriod = data.data?.filter((item) => moment(item.created_at).isSameOrAfter(thisPeriod)).length || 0;
    const itemsLastPeriod = data.data?.filter((item) => moment(item.created_at).isBetween(lastPeriod, thisPeriod)).length || 0;

    const statArrow = itemsThisPeriod >= itemsLastPeriod ? "up" : "down";
    const difference = Math.abs(itemsThisPeriod - itemsLastPeriod);
    const statPercent = itemsLastPeriod ? ((difference / itemsLastPeriod) * 100).toFixed(2) : 100;
    const statPercentColor = itemsThisPeriod >= itemsLastPeriod ? "text-emerald-500" : "text-red-500";
    const statDescription = `Par rapport au ${period === 'month' ? 'mois' : 'semaine'} dernier`;

    return {
      statArrow,
      statPercent,
      statPercentColor,
      statDescription,
    };
  };

  const studentStats = calculateStats(students, 'month');
  const institutionStats = calculateStats(institutions, 'week');
  const transactionStats = calculateStats(transactions, 'month');
  const bankAccountStats = calculateStats(bankAccounts, 'month');

  return (
    <>
      <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="TRANSACTIONS"
                  statTitle={transactions.meta?.total}
                  statArrow={transactionStats.statArrow}
                  statPercent={transactionStats.statPercent}
                  statPercentColor={transactionStats.statPercentColor}
                  statDescription={transactionStats.statDescription}
                  statIconName="fas fa-dollar-sign"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="INSTITUTIONS"
                  statTitle={institutions.meta?.total}
                  statArrow={institutionStats.statArrow}
                  statPercent={institutionStats.statPercent}
                  statPercentColor={institutionStats.statPercentColor}
                  statDescription={institutionStats.statDescription}
                  statIconName="fas fa-school"
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="ÉTUDIANTS"
                  statTitle={students.meta?.total}
                  statArrow={studentStats.statArrow}
                  statPercent={studentStats.statPercent}
                  statPercentColor={studentStats.statPercentColor}
                  statDescription={studentStats.statDescription}
                  statIconName="fas fa-users"
                  statIconColor="bg-pink-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="COMPTES BANCAIRES"
                  statTitle={bankAccounts.meta?.total}
                  statArrow={bankAccountStats.statArrow}
                  statPercent={bankAccountStats.statPercent}
                  statPercentColor={bankAccountStats.statPercentColor}
                  statDescription={bankAccountStats.statDescription}
                  statIconName="fas fa-piggy-bank"
                  statIconColor="bg-lightBlue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
