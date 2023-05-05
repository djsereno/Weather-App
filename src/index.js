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

  const time12Btn = document.querySelector('#time-12');
  const time24Btn = document.querySelector('#time-24');
  const unitsImpBtn = document.querySelector('#units-imp');
  const unitsMetBtn = document.querySelector('#units-met');

  let results = {};
  let date = new Date();

  const updateDOM = () => {
    date = new Date(Date.parse(results.location.date));

    cityElem.innerText = results.location.city;
    regionElem.innerText = results.location.region;
    dateElem.innerText = format(date, 'PPPP');
    timeElem.innerText = format(date, 'p');

    tempElem.innerText = `${results.weather.imp.temp}°F`;
    conditionElem.innerText = results.weather.imp.condition;
    conditionElem.innerText = titleCase(results.weather.imp.condition);
    feelsLikeElem.innerText = `${results.weather.imp.feelslike}°F`;
    windSpeedElem.innerText = `${results.weather.imp.wind_speed} mph`;
    windDirElem.innerText = results.weather.imp.wind_dir;
    precipElem.innerText = `${results.weather.imp.precip}%`;
    humidityElem.innerText = `${results.weather.imp.humidity}%`;
  };

  const handleSearch = async (location) => {
    if (!location) return;
    locInput.value = '';

    // FOR DEVELOPMENT USE TO AVOID WASTEFUL API CALLS
    const useAPI = false;
    if (useAPI) {
      results = await getWeather(location);
    } else {
      const response = await fetch('./sampledata.json');
      results = await response.json();
    }

    console.log(results);
    updateDOM();
  };

  const changeTime = (timeFormat) => {
    if (timeFormat === 24) {
      timeElem.innerText = format(date, 'kk:mm');
      return;
    }

    timeElem.innerText = format(date, 'p');
  };

  const changeUnits = (unitsFormat = 'imp') => {
    if (unitsFormat === 'met') {
      tempElem.innerText = `${results.weather.met.temp}°C`;
      feelsLikeElem.innerText = `${results.weather.met.feelslike}°C`;
      windSpeedElem.innerText = `${results.weather.met.wind_speed} kmh`;
      return;
    }

    tempElem.innerText = `${results.weather.imp.temp}°F`;
    feelsLikeElem.innerText = `${results.weather.imp.feelslike}°F`;
    windSpeedElem.innerText = `${results.weather.imp.wind_speed} mph`;
  };

  searchBtn.addEventListener('click', () => handleSearch(locInput.value));

  time12Btn.addEventListener('click', () => changeTime(12));
  time24Btn.addEventListener('click', () => changeTime(24));
  unitsImpBtn.addEventListener('click', () => changeUnits('imp'));
  unitsMetBtn.addEventListener('click', () => changeUnits('met'));

  handleSearch('seattle');
})();
