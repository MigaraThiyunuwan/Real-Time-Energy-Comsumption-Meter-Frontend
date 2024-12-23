import React from 'react'

function HourDataTable({ tableData}) {
  return (
    <div className='hour-data-table'>
        <h1>Today Hourly Energy Consumption</h1>
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Hour</th>
            <th>Energy (kWh)</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => (
            <tr key={index}>
              <td>Hour - {data.hour}</td>
              <td>{data.energy.toFixed(2)}</td>
            </tr>
          ))}    
        </tbody>
      </table>
    </div>
  )
}

export default HourDataTable
