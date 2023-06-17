const getIconNum = (iconURL) => iconURL.split(/[./]/).slice(-2)[0];

const callWeatherAPI = async (location) => {
  const key = 'b512bf463cd641b491323834232404';
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

const getWeatherData = async (loc = 'seattle') => {
  const data = await callWeatherAPI(loc);
  const locationData = { ...data.location };
  const weatherData = { ...data.current };
  const forecastData = { ...data.forecast.forecastday };
  const location = {
    city: locationData.name,
    region: locationData.region,
    country: locationData.country,
    date: locationData.localtime,
  };

  const weather = {
    is_day: weatherData.is_day,
    temp: { imp: Math.round(weatherData.temp_f), met: Math.round(weatherData.temp_c) },
    feelslike: {
      imp: Math.round(weatherData.feelslike_f),
      met: Math.round(weatherData.feelslike_c),
    },
    condition: {
      text: weatherData.condition.text,
      icon: getIconNum(weatherData.condition.icon),
    },
    wind_speed: { imp: Math.round(weatherData.wind_mph), met: Math.round(weatherData.wind_kph) },
    wind_degree: weatherData.wind_degree,
    wind_dir: weatherData.wind_dir,
    precip: { imp: weatherData.precip_in, met: weatherData.precip_mm },
    humidity: Math.round(weatherData.humidity),
  };

  const forecast = [];
  Object.keys(forecastData).forEach((index) => {
    const { date, day } = forecastData[index];
    const forecastWeather = {
      maxtemp: { imp: Math.round(day.maxtemp_f), met: Math.round(day.maxtemp_c) },
      mintemp: { imp: Math.round(day.mintemp_f), met: Math.round(day.mintemp_c) },
      condition: {
        text: day.condition.text,
        icon: getIconNum(day.condition.icon),
      },
      daily_chance_of_rain: Math.round(day.daily_chance_of_rain),
      daily_chance_of_snow: Math.round(day.daily_chance_of_snow),
    };
    forecast.push({ date, weather: forecastWeather });
  });

  return { location, weather, forecast };
};

export default getWeatherData;
