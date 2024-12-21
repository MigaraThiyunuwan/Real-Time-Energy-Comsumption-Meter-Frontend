import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import HourBarChart from "./HourBarChart";
import HourPieChart from "./HourPieChart";

function Dashboard() {
    const [data, setData] = useState({ voltage: 0, current: 0, power: 0 });
    const [hourData, setHourData] = useState({ h0: 0, h1: 0, h2: 0 , h3: 0, h4: 0, h5: 0, h6: 0, h7: 0, h8: 0, h9: 0, h10: 0, h11: 0, h12: 0, h13: 0, h14: 0, h15: 0, h16: 0, h17: 0, h18: 0, h19: 0, h20: 0, h21: 0, h22: 0, h23: 0 });
    const [newHourData, setNewHourdata] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
          label: "",
          data: [],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1
        }]
      });
    
    useEffect(() => {
        // Fetch data when the component mounts
        const fetchData = async () => {
          try {
            const response = await fetch('http://192.168.8.204:8080/api/energy/gethourdata'); //localhost:8080
            const data = await response.json();
            setNewHourdata(data);  // Store the fetched data in the state
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

    useEffect(() => {
        const parseMessage = (message) => {
            if (message.startsWith("Real time:")) {
                return message.replace("Real time:", "").trim();
            }else if (message.startsWith("Hour Data:")) {
                return message.replace("Hour Data:", "").trim();
            }
            return message.trim();
          };
        const socket = new WebSocket("ws://192.168.8.204:8080/energy");  
        // ws://localhost:8080/energy

        socket.onmessage = (event) => {
            const message = event.data;
            console.log("Received message:", message);
        if (message.startsWith("Real time:")) {
            const cleanMessage = parseMessage(message);

            try {
                const newData = JSON.parse(cleanMessage); // Parse JSON
                console.log("Parsed Data: ", newData);
                setData(newData); // Update the state
            } catch (error) {
                console.error("Error parsing JSON: ", error);
            }
        } else if (message.startsWith("Hour Data:")) {
            const cleanMessage = parseMessage(message);
            try {
                const newData = JSON.parse(cleanMessage); // Parse JSON
                console.log("Parsed Data: ", newData);
                setHourData(newData); // Update the state
            } catch (error) {
                console.error("Error parsing JSON: ", error);
            }
        }
        };

            socket.onclose = () => console.log("WebSocket closed");
            socket.onerror = (error) => console.error("WebSocket error", error);

            return () => socket.close();
    }, []);

    //////////////////////////////////////// this is for testing purpose only ////////////////////////////////////////////
    function generateRandomData() {
        const voltage = Math.floor(Math.random() * (240 - 100 + 1)) + 100;  // Voltage between 100 and 240
        const current = (Math.random() * (9 - 0.1) + 0.1).toFixed(2);  // Current between 0.1 and 9, rounded to 2 decimal places

        return {
            voltage: voltage,
            current: current
        };
    }

     // Sending a POST request with random data every 2 seconds (for testing)
     useEffect(() => {
        const intervalId = setInterval(() => {
            const randomData = generateRandomData();
            console.log('Sending API request with random data:', randomData);
            fetch('http://localhost:8080/api/energy/simulate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(randomData),
            })
            .then(response => response.json())
            .then(responseData => {
                console.log('API Response:', responseData);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }, 1000000); //1000

        return () => clearInterval(intervalId);
    }, []); 

   // Update chart data when newHourData changes
  useEffect(() => {
    // Extract hour and energy values from the fetched data
    const hours = newHourData.map(item => item.hour);
    const energies = newHourData.map(item => item.energy);

    setChartData({
      labels: hours,  // Hours as labels
      datasets: [{
        label: "",
        data: energies,  // Hourly power consumption data
        backgroundColor: ["#4A628A", "#7AB2D3"],
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      }]
    });
  }, [newHourData]);
    
  return (
    // className="container"
    <div >
        <div className="dashboard">
            <h1>Real Time Power Consumption</h1>

            <Chart value={data.power} min={0} max={1500} />
            <div className="data">
                <p>Voltage: {data.voltage.toFixed(2)} V</p>
                <p>Current: {data.current.toFixed(2)} A</p>
                <p>Power: {data.power.toFixed(2)} W</p>
                {/* <p>Hour16: {hourData.h16.toFixed(2)} Wh</p>
                <p>Hour17: {hourData.h17.toFixed(2)} Wh</p> */}
            </div>
                
        </div>
        <div className="hourly-consumption-bar">
            <h1>Hourly Energy Consumption in kWh for Today</h1>
            <HourBarChart chartData={chartData} />
        </div>
        {/* <div className="hourly-consumption-pie">
            <HourPieChart chartData={chartData} />
        </div> */}
        
        
    </div>
  )
}

export default Dashboard
