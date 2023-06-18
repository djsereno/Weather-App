import './normalize.css';
import './style.css';
import { format, isToday, isTomorrow, parse } from 'date-fns';
import { titleCase, getBgImage } from './helper-fns';
import getWeatherData from './weather';
import getSampleData from './sampledata';

const USE_API = true; // For dev use to avoid wasteful API calls

(() => {
  // Location data and temperature elements
  const locInput = document.querySelector('#loc');
  const locPinIcon = document.querySelector('.loc-pin');
  const spinnerIcon = document.querySelector('.spinner');
  const searchBtn = document.querySelector('#search');
  const dateElem = document.querySelector('#date');
  const timeElem = document.querySelector('#time');
  const time12Btn = document.querySelector('#time-12');
  const time24Btn = document.querySelector('#time-24');
  const tempImpElem = document.querySelector('#temp-imp');
  const tempMetElem = document.querySelector('#temp-met');
  const unitsImpBtn = document.querySelector('#units-imp');
  const unitsMetBtn = document.querySelector('#units-met');

  // Current condition elements
  const conditionElem = document.querySelector('#condition');
  const conditionIcon = document.querySelector('#condition-icon');

  // Detail information elements
  const feelsLikeImpElem = document.querySelector('#feelslike-imp');
  const feelsLikeMetElem = document.querySelector('#feelslike-met');
  const windSpeedImpElem = document.querySelector('#wind_speed-imp');
  const windSpeedMetElem = document.querySelector('#wind_speed-met');
  const windDirElem = document.querySelector('#wind_dir');
  const windDirIcon = document.querySelector('#wind-dir-icon');
  const precipImpElem = document.querySelector('#precip-imp');
  const precipMetElem = document.querySelector('#precip-met');
  const humidityElem = document.querySelector('#humidity');

  const forecastElem = document.querySelector('#forecast');
  const bgImage = document.querySelector('#bg-image');
  let weatherData = {};
  let date = new Date();

  const setTimeFormat = (timeFormat = 12) => {
    timeFormat === 24
      ? (timeElem.innerText = format(date, 'kk:mm'))
      : (timeElem.innerText = format(date, 'p'));
  };

  const setUnitFormat = (unitsFormat = 'imp') => {
    const measurementElems = document.querySelectorAll('.imp, .met');
    measurementElems.forEach((elem) => {
      elem.classList.contains(unitsFormat)
        ? elem.classList.remove('hidden')
        : elem.classList.add('hidden');
    });
  };

  const updateRealtimeDOM = () => {
    // Location data and temperature elements
    locInput.value = `${weatherData.location.city}, ${weatherData.location.region}`;
    date = new Date(Date.parse(weatherData.location.date));
    dateElem.innerText = format(date, 'EEEE, MMMM do');
    setTimeFormat(12);
    tempImpElem.innerText = `${weatherData.weather.temp.imp}°F`;
    tempMetElem.innerText = `${weatherData.weather.temp.met}°C`;

    // Current condition elements
    const iconCode = weatherData.weather.condition.icon;
    const bgImageFile = getBgImage(weatherData.weather.condition.icon);
    const dayOrNight = weatherData.weather.is_day ? 'day' : 'night';
    conditionElem.innerText = titleCase(weatherData.weather.condition.text);
    conditionIcon.setAttribute('src', `./images/icons/${dayOrNight}/${iconCode}.svg`);
    bgImage.setAttribute('src', `./images/backgrounds/${dayOrNight}/${bgImageFile}.jpg`);

    // Detail information elements
    feelsLikeImpElem.innerText = `${weatherData.weather.feelslike.imp}°F`;
    feelsLikeMetElem.innerText = `${weatherData.weather.feelslike.met}°C`;
    windSpeedImpElem.innerText = `${weatherData.weather.wind_speed.imp} mph`;
    windSpeedMetElem.innerText = `${weatherData.weather.wind_speed.met} kph`;
    windDirElem.innerText = weatherData.weather.wind_dir;
    windDirIcon.style.transform = `rotate(${weatherData.weather.wind_degree - 45}deg)`;
    humidityElem.innerText = `${weatherData.weather.humidity}%`;
    precipImpElem.innerText = `${weatherData.weather.precip.imp} in`;
    precipMetElem.innerText = `${weatherData.weather.precip.met} mm`;
  };

  const updateForecastDOM = () => {
    while (forecastElem.firstChild) {
      forecastElem.removeChild(forecastElem.lastChild);
    }

    weatherData.forecast.forEach((day) => {
      const forecastCardElem = document.createElement('div');
      const dayElem = document.createElement('div');
      const forecastIcon = document.createElement('img');
      const highLowGroup = document.createElement('div');
      const highTempGroup = document.createElement('span');
      const highTempImpElem = document.createElement('span');
      const highTempMetElem = document.createElement('span');
      const lowTempGroup = document.createElement('span');
      const lowTempImpElem = document.createElement('span');
      const lowTempMetElem = document.createElement('span');
      const precipGroup = document.createElement('div');
      const precipIcon = document.createElement('i');
      const precipForeElem = document.createElement('span');

      const forecastWeather = day.weather;
      const forecastDate = parse(day.date, 'yyyy-MM-dd', new Date());
      dayElem.innerText = format(forecastDate, 'ccc d');
      if (isToday(forecastDate)) dayElem.innerText = 'Today';
      if (isTomorrow(forecastDate)) dayElem.innerText = 'Tomorrow';
      forecastIcon.setAttribute('src', `./images/icons/day/${forecastWeather.condition.icon}.svg`);
      highTempImpElem.innerText = `${forecastWeather.maxtemp.imp}°`;
      highTempMetElem.innerText = `${forecastWeather.maxtemp.met}°`;
      lowTempImpElem.innerText = `${forecastWeather.mintemp.imp}°`;
      lowTempMetElem.innerText = `${forecastWeather.mintemp.met}°`;

      // Chance of rain/snow element
      if (forecastWeather.daily_chance_of_snow > forecastWeather.daily_chance_of_rain) {
        precipIcon.classList.add('fa-regular', 'fa-snowflake');
        precipForeElem.innerText = ` ${forecastWeather.daily_chance_of_snow}%`;
      } else if (forecastWeather.daily_chance_of_rain !== 0) {
        precipIcon.classList.add('fa-solid', 'fa-cloud-rain');
        precipForeElem.innerText = ` ${forecastWeather.daily_chance_of_rain}%`;
      }
      precipGroup.appendChild(precipIcon);
      precipGroup.appendChild(precipForeElem);

      forecastCardElem.classList.add('card', 'flex-col');
      dayElem.classList.add('day');
      forecastIcon.classList.add('forecast-icon');
      highLowGroup.classList.add('high-low');
      highTempGroup.classList.add('high-temp');
      highTempImpElem.classList.add('temp', 'imp');
      highTempMetElem.classList.add('temp', 'met');
      lowTempGroup.classList.add('low-temp');
      lowTempImpElem.classList.add('temp', 'imp');
      lowTempMetElem.classList.add('temp', 'met');
      precipGroup.classList.add('precipitation');

      forecastCardElem.appendChild(dayElem);
      forecastCardElem.appendChild(forecastIcon);
      forecastCardElem.appendChild(highLowGroup);
      highLowGroup.appendChild(highTempGroup);
      highTempGroup.appendChild(highTempImpElem);
      highTempGroup.appendChild(highTempMetElem);
      highLowGroup.appendChild(lowTempGroup);
      lowTempGroup.appendChild(lowTempImpElem);
      lowTempGroup.appendChild(lowTempMetElem);
      forecastCardElem.appendChild(precipGroup);
      forecastElem.appendChild(forecastCardElem);
    });
  };

  const toggleLoadingSpinner = () => {
    locPinIcon.classList.toggle('visible');
    spinnerIcon.classList.toggle('hidden');
  };

  const handleSearch = async (location) => {
    if (!location) return;

    toggleLoadingSpinner();
    const newWeatherData = USE_API ? await getWeatherData(location) : await getSampleData();
    toggleLoadingSpinner();
    searchBtn.classList.remove('visible');

    if (!newWeatherData) {
      locInput.classList.add('invalid-input');
      locInput.value = `${weatherData.location.city}, ${weatherData.location.region}`;
      return;
    }
    weatherData = newWeatherData;
    updateRealtimeDOM();
    updateForecastDOM();
    setUnitFormat();
  };

  const clearInput = () => {
    locInput.value = '';
    searchBtn.classList.add('visible');
  };

  const undoClearInput = () => {
    if (locInput.value !== '') return;
    locInput.value = `${weatherData.location.city}, ${weatherData.location.region}`;
    searchBtn.classList.remove('visible');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      document.activeElement.blur();
      handleSearch(locInput.value);
    }
  };

  locInput.addEventListener('focusin', () => clearInput());
  locInput.addEventListener('focusout', () => undoClearInput());
  locInput.addEventListener('animationend', () => {
    locInput.classList.remove('invalid-input');
  });
  searchBtn.addEventListener('click', () => handleSearch(locInput.value));
  document.addEventListener('keydown', (event) => handleKeyDown(event));
  time12Btn.addEventListener('click', () => setTimeFormat(12));
  time24Btn.addEventListener('click', () => setTimeFormat(24));
  unitsImpBtn.addEventListener('click', () => setUnitFormat('imp'));
  unitsMetBtn.addEventListener('click', () => setUnitFormat('met'));

  handleSearch('seattle');
})();
