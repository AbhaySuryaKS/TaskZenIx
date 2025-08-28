import React, { useState, useEffect } from "react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";

const getFormattedDate = (date) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
};

const getFormattedTime = (date) => {
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    return date.toLocaleTimeString("en-US", options);
};

const getDayName = (dateString) => {
  const date = new Date(dateString);
  const options = { weekday: "short" };
  return date.toLocaleDateString("en-US", options);
};


const getWeatherIcon = (weatherCode) => {
    switch (weatherCode) {
        case 0:
        case 1:
            return <WbSunnyIcon className="text-yellow-400" sx={{ fontSize: 30 }} />;
        case 2:
        case 3:
            return <CloudIcon className="text-gray-400" sx={{ fontSize: 30 }} />;
        case 45:
        case 48:
            return <CloudIcon className="text-gray-400" sx={{ fontSize: 30 }} />;
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
        case 61:
        case 63:
        case 65:
            return <ThunderstormIcon className="text-gray-400" sx={{ fontSize: 30 }} />;
        case 71:
        case 73:
        case 75:
            return <AcUnitIcon className="text-blue-200" sx={{ fontSize: 30 }} />;
        default:
            return <WbSunnyIcon className="text-yellow-400" sx={{ fontSize: 30 }} />;
    }
};

function WeatherBox() {
    const [weatherData, setWeatherData] = useState(null);
    const [location, setLocation] = useState("Fetching location...");
    useEffect(() => {
        const fetchWeather = async (latitude, longitude) => {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                setWeatherData(data.daily);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };
    
        const fetchLocation = async (latitude, longitude) => {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.address) {
                    const city = data.address.city || data.address.town || data.address.village;
                    const country = data.address.country;
                    setLocation(`${city || "Unknown City"}, ${country}`);
                }
            } catch (error) {
                console.error("Error fetching location:", error);
                setLocation("Unknown Location");
            }
        };
    
        const fetchAll = (latitude, longitude) => {
            fetchLocation(latitude, longitude);
            fetchWeather(latitude, longitude);
        };
    
        let weatherTimer;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchAll(latitude, longitude);
          
                    weatherTimer = setInterval(() => {
                        fetchWeather(latitude, longitude);
                    }, 3600000); 
                },
                () => {
                    setLocation("Bengaluru, India");
                    fetchWeather(12.9716, 77.5946);
                }
            );
        } else {
            setLocation("Bengaluru, India");
            fetchWeather(12.9716, 77.5946);
        }
    
        return () => {
            if (weatherTimer) {
                clearInterval(weatherTimer);
            }
        };
    }, []);

  return (
    <div className="break-inside-avoid-column h-fit bg-gray-900 border border-gray-700 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg transition-all duration-300 hover:bg-gray-800 p-5 gap-7">
      <p className="text-lg font-bold">{location}</p>
      <div className="flex justify-between w-full gap-4 overflow-x-auto no-scrollbar">
        {weatherData ? (
          weatherData.time.map((date, index) => (
            <div key={index} className="flex flex-col items-center flex-1 min-w-[70px]">
              <span className="text-xs font-semibold text-gray-400 mb-2">{getDayName(date)}</span>
              {getWeatherIcon(weatherData.weather_code[index])}
              <span className="text-sm font-bold mt-1">
                {Math.round(weatherData.temperature_2m_max[index])}°
              </span>
              <span className="text-xs text-gray-500">
                {Math.round(weatherData.temperature_2m_min[index])}°
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic text-center w-full">Loading weather data...</p>
        )}
      </div>
    </div>
  );
}

function DateWeather() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [weatherData, setWeatherData] = useState(null);
  
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 60000);
  
        const fetchWeather = async (latitude, longitude) => {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                setWeatherData(data.daily);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };
    
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                     fetchWeather(latitude, longitude);
                },
                () => {
                    fetchWeather(12.9716, 77.5946);
                }
            );
        } else {
            fetchWeather(12.9716, 77.5946);
        }
    
        return () => clearInterval(timer);
    }, []);
  
    return (
        <div className="flex flex-row items-center justify-evenly gap-2">
            <div className="flex flex-col items-center">
                <p className="text-sm font-bold">{getFormattedTime(currentDateTime)}</p>
                <p className="text-xs font-thin">{getFormattedDate(currentDateTime)}</p>
            </div>
            {weatherData ? (
                <div className="flex flex-col items-center">
                    {getWeatherIcon(weatherData.weather_code[0])}
                    <p className="text-xs">
                        {Math.round(weatherData.temperature_2m_max[0])}° /{" "}
                        {Math.round(weatherData.temperature_2m_min[0])}°
                    </p>
                </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Loading today's weather...</p>
            )}
        </div>
    );
}

export { WeatherBox, DateWeather };