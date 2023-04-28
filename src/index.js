import './normalize.css';
import './style.css';

const getWeather = async (location = 'san francisco') => {
  const key = 'b512bf463cd641b491323834232404';
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${key}&q=${location}`,
      {
        mode: 'cors',
      },
    );
    if (await !response.ok) throw new Error('Something went wrong!');
    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.error(error);
    return {};
  }
};

const parseWeather = async () => {
  const current = await getWeather();
  const locationData = { ...current.location };
  const weatherData = { ...current.current };

  const location = {
    name: locationData.name,
    region: locationData.region,
    country: locationData.country,
    time: locationData.localtime,
  };
  const weatherImperial = {
    temp: weatherData.temp_f,
    feelslike: weatherData.feelslike_f,
    condition: weatherData.condition.text,
    wind_speed: weatherData.wind_mph,
    wind_degree: weatherData.wind_degree,
    wind_dir: weatherData.wind_dir,
    precip: weatherData.precip_in,
    humidity: weatherData.humidity,
  };
  const weatherMetric = {
    temp: weatherData.temp_c,
    feelslike: weatherData.feelslike_c,
    condition: weatherData.condition.text,
    wind_speed: weatherData.wind_kph,
    wind_degree: weatherData.wind_degree,
    wind_dir: weatherData.wind_dir,
    precip: weatherData.precip_mm,
    humidity: weatherData.humidity,
  };

  const weather = { location, weather: { imp: weatherImperial, met: weatherMetric } };
  return weather;
};

(async () => {
  console.log(await parseWeather());
})();
