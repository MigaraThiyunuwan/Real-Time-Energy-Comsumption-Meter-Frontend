import React, { useEffect, useState } from "react";
import Chart from "./Chart";

function Dashboard() {
    const [data, setData] = useState({ voltage: 0, current: 0, power: 0 });

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/energy");

        socket.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            console.log(newData);
            setData(newData);
        };

        socket.onclose = () => console.log("WebSocket closed");
        socket.onerror = (error) => console.error("WebSocket error", error);

        return () => socket.close();
    }, []);

  return (
    <div className="dashboard">
        <h1>Real Time Power Consumption</h1>
        <Chart value={data.power} min={0} max={1500} />
        <div className="data">
            <p>Voltage: {data.voltage.toFixed(2)} V</p>
            <p>Current: {data.current.toFixed(2)} A</p>
            <p>Power: {data.power.toFixed(2)} W</p>
        </div>
            
    </div>
  )
}

export default Dashboard
