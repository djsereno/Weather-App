import './normalize.css';
import './style.css';
import getWeather from './weather';

(async () => {
  console.log(await getWeather());
})();
