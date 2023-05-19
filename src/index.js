import './normalize.css';
import './style.css';
import { format, isToday, isTomorrow, parse } from 'date-fns';
import getWeather from './weather';
import titleCase from './helper-fns';
import getSampleData from './sampledata';

(() => {
  const locInput = document.querySelector('#loc');
  const searchBtn = document.querySelector('#search');

  const cityElem = document.querySelector('#city');
  const regionElem = document.querySelector('#region');
  const dateElem = document.querySelector('#date');
  const timeElem = document.querySelector('#time');

  const tempImpElem = document.querySelector('#temp-imp');
  const tempMetElem = document.querySelector('#temp-met');
  const conditionElem = document.querySelector('#condition');
  const conditionIcon = document.querySelector('#condition-icon');
  const feelsLikeImpElem = document.querySelector('#feelslike-imp');
  const feelsLikeMetElem = document.querySelector('#feelslike-met');
  const windSpeedImpElem = document.querySelector('#wind_speed-imp');
  const windSpeedMetElem = document.querySelector('#wind_speed-met');
  const windDirElem = document.querySelector('#wind_dir');
  const precipImpElem = document.querySelector('#precip-imp');
  const precipMetElem = document.querySelector('#precip-met');
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

  const setMeasureVisibility = (unitsFormat = 'imp') => {
    const imperialElems = document.querySelectorAll('.imp');
    const metricElems = document.querySelectorAll('.met');

    if (unitsFormat === 'met') {
      imperialElems.forEach((elem) => elem.classList.add('hidden'));
      metricElems.forEach((elem) => elem.classList.remove('hidden'));
      return;
    }
    imperialElems.forEach((elem) => elem.classList.remove('hidden'));
    metricElems.forEach((elem) => elem.classList.add('hidden'));
  };

  const updateRealtimeDOM = () => {
    date = new Date(Date.parse(results.location.date));

    cityElem.innerText = results.location.city;
    regionElem.innerText = results.location.region;
    dateElem.innerText = format(date, 'PPPP');
    updateTimeElem(12);

    tempImpElem.innerText = `${results.weather.temp.imp}°F`;
    tempMetElem.innerText = `${results.weather.temp.met}°C`;
    conditionElem.innerText = titleCase(results.weather.condition.text);
    conditionIcon.setAttribute('src', results.weather.condition.icon);

    feelsLikeImpElem.innerText = `${results.weather.feelslike.imp}°F`;
    feelsLikeMetElem.innerText = `${results.weather.feelslike.met}°C`;
    windSpeedImpElem.innerText = `${results.weather.wind_speed.imp} mph`;
    windSpeedMetElem.innerText = `${results.weather.wind_speed.met} kph`;
    windDirElem.innerText = results.weather.wind_dir;
    humidityElem.innerText = `${results.weather.humidity}%`;
    precipImpElem.innerText = `${results.weather.precip.imp} in`;
    precipMetElem.innerText = `${results.weather.precip.met} mm`;

    const windDirIcon = document.querySelector('#wind-dir-icon');
    windDirIcon.style.transform = `rotate(${results.weather.wind_degree - 45}deg)`;
  };

  const updateForecastDOM = () => {
    while (forecastElem.firstChild) {
      forecastElem.removeChild(forecastElem.lastChild);
    }

    results.forecast.forEach((day) => {
      const forecastCardElem = document.createElement('div');
      const dayElem = document.createElement('div');
      const conditionForeIcon = document.createElement('img');
      // const conditionForeElem = document.createElement('div');
      const highLowGroup = document.createElement('div');
      const highTempGroup = document.createElement('span');
      const highTempForeImpElem = document.createElement('span');
      const highTempForeMetElem = document.createElement('span');
      const lowTempGroup = document.createElement('span');
      const lowTempForeImpElem = document.createElement('span');
      const lowTempForeMetElem = document.createElement('span');
      const precipGroup = document.createElement('div');
      const precipForeIcon = document.createElement('i');
      const precipForeElem = document.createElement('span');

      const forecastDate = parse(day.date, 'yyyy-MM-dd', new Date());
      const forecastWeather = day.weather;

      dayElem.innerText = format(forecastDate, 'ccc d');
      if (isToday(forecastDate)) dayElem.innerText = 'Today';
      if (isTomorrow(forecastDate)) dayElem.innerText = 'Tomorrow';

      conditionForeIcon.setAttribute('src', forecastWeather.condition.icon);
      // conditionForeElem.innerText = titleCase(forecastWeather.condition.text);

      highTempForeImpElem.innerText = `${forecastWeather.maxtemp.imp}°`;
      highTempForeMetElem.innerText = `${forecastWeather.maxtemp.met}°`;
      lowTempForeImpElem.innerText = `${forecastWeather.mintemp.imp}°`;
      lowTempForeMetElem.innerText = `${forecastWeather.mintemp.met}°`;

      if (forecastWeather.daily_chance_of_snow > forecastWeather.daily_chance_of_rain) {
        precipForeIcon.classList.add('fa-regular', 'fa-snowflake');
        precipForeElem.innerText = ` ${forecastWeather.daily_chance_of_snow}%`;
      } else if (forecastWeather.daily_chance_of_rain !== 0) {
        precipForeIcon.classList.add('fa-solid', 'fa-cloud-rain');
        precipForeElem.innerText = ` ${forecastWeather.daily_chance_of_rain}%`;
      }
      precipGroup.appendChild(precipForeIcon);
      precipGroup.appendChild(precipForeElem);

      forecastCardElem.classList.add('card', 'flex-col');
      dayElem.classList.add('day');
      conditionForeIcon.classList.add('forecast-icon');
      // conditionForeElem.classList.add('condition-text');
      highLowGroup.classList.add('high-low');
      highTempGroup.classList.add('high-temp');
      highTempForeImpElem.classList.add('temp', 'imp');
      highTempForeMetElem.classList.add('temp', 'met');
      lowTempGroup.classList.add('low-temp');
      lowTempForeImpElem.classList.add('temp', 'imp');
      lowTempForeMetElem.classList.add('temp', 'met');
      precipGroup.classList.add('precipitation');

      // const highTempForeIcon = document.createElement('i');
      // const lowTempForeIcon = document.createElement('i');
      // highTempForeIcon.classList.add('fa-solid', 'fa-arrow-up-long');
      // lowTempForeIcon.classList.add('fa-solid', 'fa-arrow-down-long');
      // highTempGroup.appendChild(highTempForeIcon);
      // lowTempGroup.appendChild(lowTempForeIcon);

      forecastCardElem.appendChild(dayElem);
      forecastCardElem.appendChild(conditionForeIcon);
      // forecastCardElem.appendChild(conditionForeElem);
      forecastCardElem.appendChild(highLowGroup);
      highLowGroup.appendChild(highTempGroup);
      highTempGroup.appendChild(highTempForeImpElem);
      highTempGroup.appendChild(highTempForeMetElem);
      highLowGroup.appendChild(lowTempGroup);
      lowTempGroup.appendChild(lowTempForeImpElem);
      lowTempGroup.appendChild(lowTempForeMetElem);
      forecastCardElem.appendChild(precipGroup);
      forecastElem.appendChild(forecastCardElem);
    });
  };

  const handleSearch = async (location) => {
    if (!location) return;
    locInput.value = '';

    // FOR DEVELOPMENT USE TO AVOID WASTEFUL API CALLS
    const useAPI = false;
    if (useAPI) {
      results = await getWeather(location);
      // console.log(JSON.stringify(results));
    } else {
      results = await getSampleData();
      console.log(results);
    }

    updateRealtimeDOM();
    updateForecastDOM();
    setMeasureVisibility();
  };

  searchBtn.addEventListener('click', () => handleSearch(locInput.value));

  time12Btn.addEventListener('click', () => updateTimeElem(12));
  time24Btn.addEventListener('click', () => updateTimeElem(24));
  unitsImpBtn.addEventListener('click', () => setMeasureVisibility('imp'));
  unitsMetBtn.addEventListener('click', () => setMeasureVisibility('met'));

  handleSearch('seattle');
})();
