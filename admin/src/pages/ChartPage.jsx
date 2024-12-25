import React from "react";
import RevenueChart from "../components/RevenueChart";

const ChartPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Total Revenue</h1>
      <div className="bg-white shadow rounded p-6">
        <RevenueChart />
      </div>
    </div>
  );
};

export default ChartPage;
