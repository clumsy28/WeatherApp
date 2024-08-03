import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./weather.css";

function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [inputCity, setInputCity] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appid}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setWeather(data);
        } else {
          console.log("Bir sorun oluştu");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchData();
    }
  }, [city]);

  const memoizedWeatherData = useMemo(() => {
    if (weather) {
      function kelvinToCelsius(kelvin) {
        return kelvin - 273.15;
      }
      function kelvinToCelsiusFeel(kelvinFeel) {
        return kelvinFeel - 273.15;
      }

      const kelvin = weather?.main?.temp;
      const kelvinFeel = weather?.main?.feels_like;
      const celsius = kelvin !== undefined ? kelvinToCelsius(kelvin) : null;
      const celsiusFeel =
        kelvinFeel !== undefined ? kelvinToCelsiusFeel(kelvinFeel) : null;
      const roundedCelsius = celsius !== null ? Math.round(celsius) : "N/A";
      const roundedCelsiusFeel =
        celsiusFeel !== null ? Math.round(celsiusFeel) : "N/A";
      const finalCelsius = `${roundedCelsius}°C`;
      const finalCelsiusFeel = `${roundedCelsiusFeel}°C`;
      const humidity = weather?.main?.humidity;
      const finalHumidity = `${humidity}%`;
      const windSpeed = weather?.wind?.speed;
      const finalWindSpeed = `${windSpeed} m/s`;

      return {
        city: city,
        degree: finalCelsius,
        feels_like: finalCelsiusFeel,
        description: weather?.weather?.[0]?.description,
        humidity: finalHumidity,
        wind: finalWindSpeed,
      };
    }
    return null;
  }, [weather, city]);

  const handleInputChange = (e) => {
    setInputCity(e.target.value);
  };

  const handleSearch = () => {
    setCity(inputCity);
  };

  if (loading) {
    return <div>yükleniyor</div>;
  }

  const weatherData = memoizedWeatherData;

  return (
    <div className="container">
      <div className="input-container">
        <div className="inputArea">
          <input
            type="text"
            value={inputCity}
            onChange={handleInputChange}
            placeholder="Şehir Giriniz"
            className="input"
          />
          <FontAwesomeIcon
            icon={faSearch}
            onClick={handleSearch}
            className="searchIcon"
          />
        </div>
      </div>

      {weatherData ? (
        <div className="inner">
          <p className="city">{weatherData.city}</p>
          <p className="degree">{weatherData.degree}</p>
          <p>Hissedilen sıcaklık:{weatherData.feels_like}</p>
          <p>{weatherData.description}</p>
          <p>Nem: {weatherData.humidity}</p>
          <p>Rüzgar hızı:{weatherData.wind}</p>
        </div>
      ) : (
        <div>Lütfen şehir giriniz</div>
      )}
    </div>
  );
}

export default Weather;
