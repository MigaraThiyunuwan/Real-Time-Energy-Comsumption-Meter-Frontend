import React from 'react'

import { Pie } from 'react-chartjs-2' 
import{Chart as ChartJS} from 'chart.js/auto'

function HourPieChart({chartData}) {
  return (
    <div className='hour-consumption'>
        <Pie data={chartData} options={{}} />
    </div>

  )
}

export default HourPieChart
