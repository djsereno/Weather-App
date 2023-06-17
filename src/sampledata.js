// For dev use to avoid wasteful API calls

const jsonString =
  '{"location":{"city":"Seattle","region":"Washington","country":"United States of America","date":"2023-05-05 18:30"},"weather":{"temp":{"imp":51,"met":11},"feelslike":{"imp":49,"met":10},"condition":{"text":"Overcast","icon":"122","code":1009},"wind_speed":{"imp":7,"met":11},"wind_degree":170,"wind_dir":"S","precip":{"imp":0.02,"met":0.6},"humidity":89},"forecast":[{"date":"2023-05-05","weather":{"maxtemp":{"imp":49,"met":9},"mintemp":{"imp":47,"met":9},"condition":{"text":"Moderate rain","icon":"302","code":1189},"daily_chance_of_rain":89,"daily_chance_of_snow":0}},{"date":"2023-05-06","weather":{"maxtemp":{"imp":56,"met":13},"mintemp":{"imp":46,"met":8},"condition":{"text":"Patchy rain possible","icon":"176","code":1063},"daily_chance_of_rain":85,"daily_chance_of_snow":0}},{"date":"2023-05-07","weather":{"maxtemp":{"imp":61,"met":16},"mintemp":{"imp":45,"met":7},"condition":{"text":"Partly cloudy","icon":"116","code":1003},"daily_chance_of_rain":0,"daily_chance_of_snow":0}},{"date":"2023-05-08","weather":{"maxtemp":{"imp":63,"met":17},"mintemp":{"imp":41,"met":5},"condition":{"text":"Partly cloudy","icon":"116","code":1003},"daily_chance_of_rain":0,"daily_chance_of_snow":0}},{"date":"2023-05-09","weather":{"maxtemp":{"imp":62,"met":17},"mintemp":{"imp":48,"met":9},"condition":{"text":"Overcast","icon":"122","code":1009},"daily_chance_of_rain":0,"daily_chance_of_snow":0}},{"date":"2023-05-10","weather":{"maxtemp":{"imp":68,"met":20},"mintemp":{"imp":47,"met":8},"condition":{"text":"Sunny","icon":"113","code":1000},"daily_chance_of_rain":0,"daily_chance_of_snow":0}},{"date":"2023-05-11","weather":{"maxtemp":{"imp":72,"met":22},"mintemp":{"imp":46,"met":8},"condition":{"text":"Partly cloudy","icon":"116","code":1003},"daily_chance_of_rain":0,"daily_chance_of_snow":0}}]}';

function getSampleData() {
  return JSON.parse(jsonString);
}

export default getSampleData;
