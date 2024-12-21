import React from "react";

const Chart = ({ value, min, max }) => {
    // Normalize the value to fit within 0-180 degrees
    const normalizedValue = Math.min(Math.max(value, min), max); // Clamp the value between min and max
    const rotation = ((normalizedValue - min) / (max - min)) * 125; // Scale value to degrees
    console.log("Rotation: "+rotation);

    let progressClass = "gauge-progress1"; // Default class
    if (rotation > 35 && rotation <= 90) {
        progressClass = "gauge-progress2";
    } else if (rotation > 90) {
        progressClass = "gauge-progress3";
    }
  
    return (

            <div className="gauge-chart">
                <div className="gauge">
                <svg className="gauge-svg" viewBox="0 0 100 50">
                    <path
                    d="M10,50 A40,40 0 0,1 90,50"
                    className="gauge-bg"
                    />
                    <path
                    d="M10,50 A40,40 0 0,1 90,50"
                    className={progressClass}
                    style={{ strokeDasharray: `${rotation} 180` }}
                    />
                </svg>
                <div className="gauge-value">
                    <span>{value.toFixed(2)}</span>
                    <p>Watts</p>
                </div>
                </div>
                <h3>POWER CONSUMPTION</h3>
            </div>

    );
  };
  
  export default Chart;
