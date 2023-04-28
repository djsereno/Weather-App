import './normalize.css';
import './style.css';

async function getWeather(location = '-') {
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
}

getWeather();
