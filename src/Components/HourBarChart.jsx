import React from 'react'
import { Bar } from 'react-chartjs-2' 
import{Chart as ChartJS} from 'chart.js/auto'

function HourBarChart({chartData}) {
  const options = {
    responsive: true, // Makes the chart responsive
    plugins: {
        legend: {
            display: true, // Show the dataset legend
        },
    },
    scales: {
        x: {
            title: {
                display: true, // Show the label on the x-axis
                text: 'Hours of the Day', // Label text for the x-axis
                font: {
                  weight: 'bold', // Make the label bold
                  size: 16, // Set font size (optional)
                  family: 'Arial', // Set font family (optional)
              },
            },
        },
        y: {
            title: {
                display: true, // Show the label on the y-axis
                text: 'Power Consumption (Kilo Watts)', // Label text for the y-axis
                font: {
                  weight: 'bold', // Make the label bold
                  size: 16, // Set font size (optional)
                  family: 'Arial', // Set font family (optional)
              },
            },
        },
    },
};
  return (

    <div className='hour-consumption'>
        <Bar data={chartData} options={options} />
    </div>

  )
}

export default HourBarChart
