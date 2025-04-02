import dotenv from 'dotenv';
dotenv.config();


// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}
// TODO: Define a class for the Weather object
class Weather {
  tempF: number;
  description: string;
  humidity: number;
  windSpeed: number;
  date: string; 
  icon: string; 
  iconDescription: string;
  city: string;

  constructor(tempF: number, description: string, humidity: number, windSpeed: number,   date: string, icon: string, iconDescription: string, city: string) {
    this.tempF = tempF;
    this.description = description;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.city = city;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private cityName: string;
  // TODO: Define the baseURL, API key, and city name properties
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
    return response.json();
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0];
    return { latitude: lat, longitude: lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.cityName}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=imperial`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather[] {
    const {city, list } = response;
    const weatherArray: Weather[] = [];
  
    for (let i = 0; i < list.length; i += 8) {
      
      const timestamp = list[i].dt;
      const date = new Date(timestamp * 1000)
      const options: Intl.DateTimeFormatOptions = { weekday: 'long' }
      const dayOfWeek = date.toLocaleDateString('en-US', options);
      const icon = list[i].weather[0].icon;
      const iconDescription = list[i].weather[0].description;
      
      weatherArray.push(
        new Weather(
          list[i].main.temp,                  
          list[i].weather[0].description,  
          list[i].main.humidity,        
          list[i].wind.speed,         
          dayOfWeek,                   
          icon,                        
          iconDescription,
          city.name   
        )
      );
    }
  
    return city && weatherArray;
  }
  
  
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData);
  }
}

export default new WeatherService();