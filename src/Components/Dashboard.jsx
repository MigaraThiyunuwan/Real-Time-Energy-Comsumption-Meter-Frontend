import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import HourBarChart from "./HourBarChart";
import DayLineChart from "./DayLineChart";
import a from "../images/a.png";
import v from "../images/v.png";
import w from "../images/w.png";
import HourDataTable from "./HourDataTable";
import DayDataTable from "./DayDataTable";

function Dashboard() {
    const [data, setData] = useState({ voltage: 0, current: 0, power: 0 });
    const [hourData, setHourData] = useState({ h0: 0, h1: 0, h2: 0 , h3: 0, h4: 0, h5: 0, h6: 0, h7: 0, h8: 0, h9: 0, h10: 0, h11: 0, h12: 0, h13: 0, h14: 0, h15: 0, h16: 0, h17: 0, h18: 0, h19: 0, h20: 0, h21: 0, h22: 0, h23: 0 });
    const [newHourData, setNewHourdata] = useState([]);
    const [dayData , setDayData] = useState([]);
    const [today, setToday] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [dailyUsage, setDailyUsage] = useState(0);

    const updateToday = () => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
        setToday(formattedDate);
      };
    
      useEffect(() => {
        updateToday(); // Set today when the component mounts
      }, []);

      const updateTime = () => {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString(); // Format time as HH:MM:SS
        setCurrentTime(formattedTime);
      };
    
      useEffect(() => {
        updateTime(); // Set initial time
        const interval = setInterval(updateTime, 1000); // Update every second
        return () => clearInterval(interval); // Cleanup interval on unmount
      }, []);


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

    const [dayChartData, setDayChartData] = useState({
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
            const response = await fetch('http://192.168.180.69:8080/api/energy/gethourdata'); //localhost:8080
            const data = await response.json();
            setNewHourdata(data);  // Store the fetched data in the state

            // Calculate the sum of energy
            const totalEnergy = data.reduce((sum, item) => sum + item.energy, 0);
            setDailyUsage(totalEnergy);  // Update the dailyUsage state with the sum
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

      useEffect(() => {
        // Fetch data when the component mounts
        const fetchData = async () => {
          try {
            const response = await fetch('http://192.168.180.69:8080/api/energy/getdaydata'); //localhost:8080
            const data = await response.json();
            setDayData(data);  // Store the fetched data in the state
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
        const socket = new WebSocket("ws://192.168.180.69:8080/energy");  
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
                
                setDailyUsage((prevDailyUsage) => prevDailyUsage + newData.power); // Update daily usage
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

  // Update day chart data when newHourData changes
  useEffect(() => {
    // Extract hour and energy values from the fetched data
    const days = dayData.map(item => item.date);
    const energies = dayData.map(item => item.energy);

    setDayChartData({
      labels: days,  // Hours as labels
      datasets: [{
        label: "",
        data: energies,  // Hourly power consumption data
        backgroundColor: ["#4A628A", "#7AB2D3"],
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      }]
    });
  }, [dayData]);
    
  return (
    // className="container"
    <div >
        <div className="dashboard">
            <h1>Real Time Power Consumption</h1>

          <div className="chart-container">
            <Chart value={data.current} min={0} max={150} icon='mA' name='CURRENT CONSUMPTION'/>
            <Chart value={data.voltage} min={0} max={300} icon='V' name='VOLTAGE CONSUMPTION'/>
            <Chart value={data.power} min={0} max={100} icon='W' name='POWER CONSUMPTION'/>
          </div>
            

                
        </div>
        <div className="data-container">
            <div className="date-row">
                <div className="date">
                    <h1>Date:</h1>
                    <p>{today}</p>
                </div>
                <div className="date">
                    <h1>Time:</h1>
                    <p>{currentTime}</p>
                </div>
                <div className="date">
                    <h1>Daily Usage:</h1>
                    <p>{dailyUsage.toFixed(2)} W</p>
                </div>
                    
            </div>
            <div className="data-cards">
                <div className="data-card">
                    <div className="data-card-img">
                        <img src={a} alt="A" />
                    </div>
                    <div className="data-card-content">
                        <h1>Current:</h1>
                        <p>{data.current.toFixed(2)} A</p>
                    </div>
                    
                </div>
                <div className="data-card">
                    <div className="data-card-img">
                        <img src={v} alt="V" />
                    </div>
                    <div className="data-card-content">
                        <h1>Voltage:</h1>
                        <p>{data.voltage.toFixed(2)} V</p>
                    </div>
                    
                </div>
                <div className="data-card">
                    <div className="data-card-img">
                        <img src={w} alt="W "/>
                    </div>
                    <div className="data-card-content">
                        <h1>Power:</h1>
                        <p>{data.power.toFixed(2)} W</p>
                    </div>
                    
                </div>

            </div>

        </div>
        <div className="hourly-consumption-bar">
            <h1>Hourly Energy Consumption in Wh for Today</h1>
            <HourBarChart chartData={chartData} />
        </div>
        <div className="hourly-consumption-bar">
            <h1>Daily Energy Consumption in kWh for this Month</h1>
            <DayLineChart chartData={dayChartData} />
        </div>

        <div>
          <HourDataTable tableData={newHourData}/>
        </div>
        <div>
          <DayDataTable tableData={dayData}/>
        </div>

        
        
        
    </div>
  )
}

export default Dashboard
