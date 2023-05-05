import './normalize.css';
import './style.css';
import { format } from 'date-fns';
import getWeather from './weather';
import titleCase from './helper-fns';

(() => {
  const locInput = document.querySelector('#loc');
  const searchBtn = document.querySelector('#search');

  const cityElem = document.querySelector('#city');
  const regionElem = document.querySelector('#region');
  const dateElem = document.querySelector('#date');
  const timeElem = document.querySelector('#time');
  const tempElem = document.querySelector('#temp');
  const conditionElem = document.querySelector('#condition');
  const feelsLikeElem = document.querySelector('#feelslike');
  const windSpeedElem = document.querySelector('#wind_speed');
  const windDirElem = document.querySelector('#wind_dir');
  const precipElem = document.querySelector('#precip');
  const humidityElem = document.querySelector('#humidity');

  const updateDOM = (results) => {
    cityElem.innerText = results.location.city;
    regionElem.innerText = results.location.region;
    dateElem.innerText = format(results.location.date, 'PPPP');
    timeElem.innerText = format(results.location.date, 'p');

    tempElem.innerText = `${results.weather.imp.temp}°`;
    conditionElem.innerText = results.weather.imp.condition;
    conditionElem.innerText = titleCase(results.weather.imp.condition);
    feelsLikeElem.innerText = `${results.weather.imp.feelslike}°`;
    windSpeedElem.innerText = `${results.weather.imp.wind_speed} mph`;
    windDirElem.innerText = results.weather.imp.wind_dir;
    precipElem.innerText = `${results.weather.imp.precip}%`;
    humidityElem.innerText = `${results.weather.imp.humidity}%`;
  };

  const handleSearch = async (location) => {
    if (!location) return;
    locInput.value = '';

    const results = await getWeather(location);
    console.log(results);
    updateDOM(results);
  };

  searchBtn.addEventListener('click', () => handleSearch(locInput.value));
  handleSearch('seattle');
})();
