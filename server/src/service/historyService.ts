import * as fs from 'fs/promises';
import * as path from 'path';

// TODO: Define a City class with name and id properties
class City {
  constructor(public id: string, public name: string) { }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath = path.join(__dirname, 'searchHistory.json');

  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    const data = JSON.stringify(cities, null, 2);
    await fs.writeFile(this.filePath, data, 'utf-8');
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json fil
  async addCity(name: string): Promise<void> {
    const cities = await this.read();
    const id = (cities.length + 1).toString();
    const newCity = new City(id, name);
    cities.push(newCity);
    await this.write(cities);
  }
  
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();
