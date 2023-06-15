import './normalize.css';
import './style.css';
import { format, isToday, isTomorrow, parse } from 'date-fns';
import getWeather from './weather';
import { titleCase, getBgImage } from './helper-fns';
import getSampleData from './sampledata';

(() => {
  const locInput = document.querySelector('#loc');
  const locPinIcon = document.querySelector('.loc-pin');
  const spinnerIcon = document.querySelector('.spinner');
  const searchBtn = document.querySelector('#search');

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
  const bgImage = document.querySelector('#bg-image');

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

  const toggleSpinnerVisibility = () => {
    locPinIcon.classList.toggle('visible');
    spinnerIcon.classList.toggle('hidden');
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

    locInput.value = `${results.location.city}, ${results.location.region}`;

    dateElem.innerText = format(date, 'EEEE, MMMM do');
    updateTimeElem(12);

    tempImpElem.innerText = `${results.weather.temp.imp}°F`;
    tempMetElem.innerText = `${results.weather.temp.met}°C`;
    conditionElem.innerText = titleCase(results.weather.condition.text);

    const iconCode = results.weather.condition.icon;
    const bgImageFile = getBgImage(results.weather.condition.icon);

    if (results.weather.is_day) {
      conditionIcon.setAttribute('src', `./images/icons/day/${iconCode}.svg`);
      bgImage.setAttribute('src', `./images/backgrounds/day/${bgImageFile}.jpg`);
    } else {
      conditionIcon.setAttribute('src', `./images/icons/night/${iconCode}.svg`);
      bgImage.setAttribute('src', `./images/backgrounds/night/${bgImageFile}.jpg`);
    }

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

      conditionForeIcon.setAttribute(
        'src',
        `./images/icons/day/${forecastWeather.condition.icon}.svg`,
      );

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
      highLowGroup.classList.add('high-low');
      highTempGroup.classList.add('high-temp');
      highTempForeImpElem.classList.add('temp', 'imp');
      highTempForeMetElem.classList.add('temp', 'met');
      lowTempGroup.classList.add('low-temp');
      lowTempForeImpElem.classList.add('temp', 'imp');
      lowTempForeMetElem.classList.add('temp', 'met');
      precipGroup.classList.add('precipitation');

      forecastCardElem.appendChild(dayElem);
      forecastCardElem.appendChild(conditionForeIcon);
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

    toggleSpinnerVisibility();

    // FOR DEVELOPMENT USE TO AVOID WASTEFUL API CALLS
    const useAPI = false;
    if (useAPI) {
      results = await getWeather(location);
      // console.log(JSON.stringify(results));
    } else {
      results = await getSampleData();
    }

    toggleSpinnerVisibility();
    updateRealtimeDOM();
    updateForecastDOM();
    setMeasureVisibility();
    searchBtn.classList.remove('visible');
  };

  const clearInput = () => {
    locInput.value = '';
    searchBtn.classList.add('visible');
  };

  const undoClearInput = () => {
    if (locInput.value !== '') return;
    locInput.value = `${results.location.city}, ${results.location.region}`;
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
  searchBtn.addEventListener('click', () => handleSearch(locInput.value));
  document.addEventListener('keydown', (event) => handleKeyDown(event));

  time12Btn.addEventListener('click', () => updateTimeElem(12));
  time24Btn.addEventListener('click', () => updateTimeElem(24));
  unitsImpBtn.addEventListener('click', () => setMeasureVisibility('imp'));
  unitsMetBtn.addEventListener('click', () => setMeasureVisibility('met'));

  handleSearch('seattle');
})();
