const key = 'b512bf463cd641b491323834232404';

const fetchWeather = async (location) => {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${location}&days=7`,
      {
        mode: 'cors',
      },
    );
    if (await !response.ok) throw new Error('Something went wrong!');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

const getWeather = async (loc = 'san francisco') => {
  const data = await fetchWeather(loc);

  const locationData = { ...data.location };
  const weatherData = { ...data.current };
  const forecastData = { ...data.forecast.forecastday };

  const location = {
    city: locationData.name,
    region: locationData.region,
    country: locationData.country,
    date: locationData.localtime,
  };

  const weatherImp = {
    temp: weatherData.temp_f,
    feelslike: weatherData.feelslike_f,
    condition: weatherData.condition.text,
    wind_speed: weatherData.wind_mph,
    wind_degree: weatherData.wind_degree,
    wind_dir: weatherData.wind_dir,
    precip: weatherData.precip_in,
    humidity: weatherData.humidity,
  };
  const weatherMet = {
    temp: weatherData.temp_c,
    feelslike: weatherData.feelslike_c,
    condition: weatherData.condition.text,
    wind_speed: weatherData.wind_kph,
    wind_degree: weatherData.wind_degree,
    wind_dir: weatherData.wind_dir,
    precip: weatherData.precip_mm,
    humidity: weatherData.humidity,
  };

  const forecast = [];
  Object.keys(forecastData).forEach((index) => {
    const { date, day } = forecastData[index];
    const forecastImp = {
      maxtemp: day.maxtemp_f,
      mintemp: day.mintemp_f,
      condition: day.condition.text,
      daily_chance_of_rain: day.daily_chance_of_rain,
      daily_chance_of_snow: day.daily_chance_of_snow,
    };
    const forecastMet = {
      maxtemp: day.maxtemp_c,
      mintemp: day.mintemp_c,
      condition: day.condition.text,
      daily_chance_of_rain: day.daily_chance_of_rain,
      daily_chance_of_snow: day.daily_chance_of_snow,
    };
    forecast.push({ date, weather: { imp: forecastImp, met: forecastMet } });
  });

  return { location, weather: { imp: weatherImp, met: weatherMet }, forecast };
};

export default getWeather;
