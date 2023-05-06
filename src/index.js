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
    feelsLikeImpElem.innerText = `${results.weather.feelslike.imp}°F`;
    feelsLikeMetElem.innerText = `${results.weather.feelslike.met}°C`;
    windSpeedImpElem.innerText = `${results.weather.wind_speed.imp} mph`;
    windSpeedMetElem.innerText = `${results.weather.wind_speed.met} kph`;
    windDirElem.innerText = results.weather.wind_dir;
    humidityElem.innerText = `${results.weather.humidity}%`;
    precipImpElem.innerText = `${results.weather.precip.imp} in`;
    precipMetElem.innerText = `${results.weather.precip.met} mm`;
  };

  const updateForecastDOM = () => {
    while (forecastElem.firstChild) {
      forecastElem.removeChild(forecastElem.lastChild);
    }

    results.forecast.forEach((day) => {
      const forecastCardElem = document.createElement('div');
      const dayElem = document.createElement('div');
      const highTempGroup = document.createElement('div');
      const highTempForeImpElem = document.createElement('span');
      const highTempForeMetElem = document.createElement('span');
      const lowTempGroup = document.createElement('div');
      const lowTempForeImpElem = document.createElement('span');
      const lowTempForeMetElem = document.createElement('span');
      const conditionForeElem = document.createElement('div');
      const precipForeElem = document.createElement('div');
      const forecastDate = parse(day.date, 'yyyy-MM-dd', new Date());
      const forecastWeather = day.weather;

      dayElem.innerText = format(forecastDate, 'ccc d');
      if (isToday(forecastDate)) dayElem.innerText = 'Today';
      if (isTomorrow(forecastDate)) dayElem.innerText = 'Tomorrow';

      highTempForeImpElem.innerText = `${forecastWeather.maxtemp.imp}°F`;
      highTempForeMetElem.innerText = `${forecastWeather.maxtemp.met}°C`;
      lowTempForeImpElem.innerText = `${forecastWeather.mintemp.imp}°F`;
      lowTempForeMetElem.innerText = `${forecastWeather.mintemp.met}°C`;
      conditionForeElem.innerText = titleCase(forecastWeather.condition.text);
      forecastWeather.daily_chance_of_snow > forecastWeather.daily_chance_of_rain
        ? (precipForeElem.innerText = `${forecastWeather.daily_chance_of_snow}%`)
        : (precipForeElem.innerText = `${forecastWeather.daily_chance_of_rain}%`);

      forecastCardElem.classList.add('card');
      highTempForeImpElem.classList.add('temp', 'imp');
      highTempForeMetElem.classList.add('temp', 'met');
      lowTempForeImpElem.classList.add('temp', 'imp');
      lowTempForeMetElem.classList.add('temp', 'met');

      forecastCardElem.appendChild(dayElem);
      forecastCardElem.appendChild(highTempGroup);
      highTempGroup.appendChild(highTempForeImpElem);
      highTempGroup.appendChild(highTempForeMetElem);
      forecastCardElem.appendChild(lowTempGroup);
      lowTempGroup.appendChild(lowTempForeImpElem);
      lowTempGroup.appendChild(lowTempForeMetElem);
      forecastCardElem.appendChild(conditionForeElem);
      forecastCardElem.appendChild(precipForeElem);
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
