'use client'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChart = ( { accounts }: DoughnutChartProps ) => {

  const accountNames = accounts.map((name) => name.name)
  const balances = accounts.map((balance) => balance.currentBalance)
    
    const data = {
        datasets: [
            {
                label: "Banks",
                data: balances, 
                backgroundColor: ['#0747b6', '#2265D8', '#2f91fa']
            }
        ],
        labels: accountNames
    }
  return (
    <Doughnut data={data} 
    options={{ cutout: '60%',
              plugins: {
                legend: {
                  display: false
                }
              }
          }}



    
    />
  )
}

export default DoughnutChart
