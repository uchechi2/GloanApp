"use client"

import react from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);



const AdminDoughnutChart = ({ adminData }: AdminDoughnutChartProps) => {
  const accountNames = adminData?.map((a) => a.name);
  // const balances = accounts.map((a) => a.currentBalance)
  

  // console.log('donuts ', accounts);
  // const accountNames = accounts[0].name;
  const balances = [adminData[0].currentBalance, adminData[0].availableBalance]

  const data = {
    datasets: [
      {
        label: 'Available',
        data: balances,
        backgroundColor: ['#0747b6', '#9f65d8', '#2f91fa'] 
      }
    ],
    labels: accountNames
  }

   return (
  <Doughnut 
    data={data} 
    options={{
      cutout: '60%',
      plugins: {
        legend: {
          display: false
        }
      }
    }}
  />)
}

export default AdminDoughnutChart