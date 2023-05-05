import './normalize.css';
import './style.css';
import { format, isToday, isTomorrow, parse } from 'date-fns';
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
  const forecastElem = document.querySelector('#forecast');

  const time12Btn = document.querySelector('#time-12');
  const time24Btn = document.querySelector('#time-24');
  const unitsImpBtn = document.querySelector('#units-imp');
  const unitsMetBtn = document.querySelector('#units-met');

  let results = {};
  let date = new Date();

  const updateTimeElem = (timeFormat) => {
    if (timeFormat === 24) {
      timeElem.innerText = format(date, 'kk:mm');
      return;
    }
    timeElem.innerText = format(date, 'p');
  };

  const updateMeasureElems = (unitsFormat = 'imp') => {
    if (unitsFormat === 'met') {
      tempElem.innerText = `${results.weather.met.temp}°C`;
      feelsLikeElem.innerText = `${results.weather.met.feelslike}°C`;
      windSpeedElem.innerText = `${results.weather.met.wind_speed} kmh`;
      precipElem.innerText = `${results.weather.met.precip} mm`;
      return;
    }
    tempElem.innerText = `${results.weather.imp.temp}°F`;
    feelsLikeElem.innerText = `${results.weather.imp.feelslike}°F`;
    windSpeedElem.innerText = `${results.weather.imp.wind_speed} mph`;
    precipElem.innerText = `${results.weather.imp.precip} in`;
  };

  const updateRealtimeDOM = () => {
    date = new Date(Date.parse(results.location.date));

    cityElem.innerText = results.location.city;
    regionElem.innerText = results.location.region;
    dateElem.innerText = format(date, 'PPPP');
    updateTimeElem(12);

    conditionElem.innerText = results.weather.imp.condition;
    conditionElem.innerText = titleCase(results.weather.imp.condition);
    windDirElem.innerText = results.weather.imp.wind_dir;
    humidityElem.innerText = `${results.weather.imp.humidity}%`;
    updateMeasureElems('imp');
  };

  const updateForecastDOM = () => {
    while (forecastElem.firstChild) {
      forecastElem.removeChild(forecastElem.lastChild);
    }

    results.forecast.forEach((day) => {
      const forecastCardElem = document.createElement('div');
      const dayElem = document.createElement('div');
      const highTempForeElem = document.createElement('div');
      const lowTempForeElem = document.createElement('div');
      const conditionForeElem = document.createElement('div');
      const precipForeElem = document.createElement('div');
      const forecastDate = parse(day.date, 'yyyy-MM-dd', new Date());

      dayElem.innerText = format(forecastDate, 'cccc');
      if (isToday(forecastDate)) dayElem.innerText = 'Today';
      if (isTomorrow(forecastDate)) dayElem.innerText = 'Tomorrow';

      highTempForeElem.innerText = `${day.weather.imp.maxtemp}°F`;
      lowTempForeElem.innerText = `${day.weather.imp.mintemp}°F`;
      conditionForeElem.innerText = titleCase(day.weather.imp.condition);
      precipForeElem.innerText = `${day.weather.imp.daily_chance_of_rain}%`;

      forecastCardElem.appendChild(dayElem);
      forecastCardElem.appendChild(highTempForeElem);
      forecastCardElem.appendChild(lowTempForeElem);
      forecastCardElem.appendChild(conditionForeElem);
      forecastCardElem.appendChild(precipForeElem);
      forecastElem.appendChild(forecastCardElem);
    });
  };

  const handleSearch = async (location) => {
    if (!location) return;
    locInput.value = '';

    // FOR DEVELOPMENT USE TO AVOID WASTEFUL API CALLS
    const useAPI = true;
    if (useAPI) {
      results = await getWeather(location);
    } else {
      const response = await fetch('./sampledata.json');
      results = await response.json();
    }

    updateRealtimeDOM();
    updateForecastDOM();
  };

  searchBtn.addEventListener('click', () => handleSearch(locInput.value));

  time12Btn.addEventListener('click', () => updateTimeElem(12));
  time24Btn.addEventListener('click', () => updateTimeElem(24));
  unitsImpBtn.addEventListener('click', () => updateMeasureElems('imp'));
  unitsMetBtn.addEventListener('click', () => updateMeasureElems('met'));

  handleSearch('seattle');
})();
