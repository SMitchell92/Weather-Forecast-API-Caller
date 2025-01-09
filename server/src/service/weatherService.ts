import dotenv from 'dotenv';
dotenv.config();

// x TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// x TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  description: string;
  humidity: number;
  icon: string;
  tempF: number;
  windSpeed: number;

  constructor(
    city: string,
    date: string,
    description: string,
    humidity: number,
    icon: string,
    temperature: number,
    wind: number
  ) {
    this.city = city;
    this.date = date;
    this.description = description;
    this.humidity = humidity;
    this.icon = icon;
    this.tempF = temperature;
    this.windSpeed = wind;
  }
}
// x TODO: Complete the WeatherService class
class WeatherService {
    // x TODO: Define the baseURL, API key, and city name properties
  baseURL: string;
  apiKey: string;
  cityName: string;
  constructor(
  ) {
    this.baseURL = process.env.API_BASE_URL as string;
    this.apiKey = process.env.API_KEY as string;
    this.cityName = "";
  }
  private async fetchLocationData (query: string) { 
    const response = await fetch(query);
    const locationData = await response.json();
    return locationData;
  } 
  private destructureLocationData(locationData: any): Coordinates {
    const lat = locationData[0].lat;
    const lon = locationData[0].lon;
    return {lat, lon};
  }
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&appid=${this.apiKey}`;

  }
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }
  private async fetchWeatherData(coordinates: Coordinates) {
    let query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    const weatherData = await response.json();
    return weatherData;
  }
  private parseCurrentWeather(response: any) {
    return new Weather(
      this.cityName,
      new Date(response.dt * 1000).toLocaleDateString(),
      response.weather[0].description,
      response.main.humidity,
      response.weather[0].icon,
      response.main.temp,
      response.wind.speed
    );
  }
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = [currentWeather];
    console.log(weatherData);
    for (let i = 1; i < weatherData.length; i++) {
      forecastArray.push({
        date: new Date(weatherData[i].dt_txt * 1000).toLocaleDateString(),
        description: weatherData[i].weather[0].description,
        icon: weatherData[i].weather[0].icon,
        tempF: weatherData[i].main.temp,
        humidity: weatherData[i].main.humidity,
        city: this.cityName,
        windSpeed: weatherData[i].wind.speed,
      });
    }
    return forecastArray;
  }
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
    const forecast = this.buildForecastArray(currentWeather, weatherData);
    console.log(`here is the ${forecast}`);
    return forecast;
  }
}
  // ? TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  // ? TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  // ?? TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // ? TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // ? TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // ? TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // ? TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // ? TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // ? TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}

export default new WeatherService();
