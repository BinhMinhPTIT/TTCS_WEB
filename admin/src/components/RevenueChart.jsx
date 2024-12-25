import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:4000/api/order/revenue-by-month", {
          params: { year: selectedYear }
        });

        if (response.data.success) {
          const monthlyData = response.data.data;
          
          setChartData({
            labels: [
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ],
            datasets: [{
              label: "Monthly Revenue ($)",
              data: monthlyData.map(item => item.totalRevenue),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            }]
          });
        } else {
          throw new Error(response.data.message || "Failed to fetch revenue data");
        }
      } catch (error) {
        setError(error.response?.data?.message || error.message || "Error fetching revenue data");
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [selectedYear]);

  const yearOptions = Array.from({ length: 5 }, (_, index) => {
    const year = new Date().getFullYear() - index;
    return <option key={year} value={year}>{year}</option>;
  });

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Monthly Revenue Chart</h2>
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {yearOptions}
        </select>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600">Loading chart data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && chartData && (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: `Revenue by Month (${selectedYear})`,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value = context.raw;
                    return `Revenue: $${value.toLocaleString()}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => `$${value.toLocaleString()}`
                }
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default RevenueChart;