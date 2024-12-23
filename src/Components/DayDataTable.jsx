import React from 'react'

function DayDataTable({ tableData}) {
  return (
    <div className='hour-data-table'>
        <h1> Daily Energy Consumption</h1>
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Energy (kWh)</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => (
            <tr key={index}>
              <td>{data.date}</td>
              <td>{data.energy.toFixed(2)}</td>
            </tr>
          ))}    
        </tbody>
      </table>
    </div>
  )
}

export default DayDataTable
