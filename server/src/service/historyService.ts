import fs from 'node:fs';
import {v4 as uuidv4} from 'uuid';
// // X TODO: Define a City class with name and id properties
class City {
    name: string;
    id: string;

    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
    }
}
// // ? TODO: Complete the HistoryService class
class HistoryService {
    cities: City[] = [];
    constructor() {
        this.cities = [];
    }
    private async read() {
        const data = await fs.promises.readFile('db/searchHistory.json', { encoding: 'utf-8' });
        console.log(`data:`, data);
        const citiesArray = [];
        //iterate through data and make a city instance and push it to cities array
        for (const city of JSON.parse(data)) {
            citiesArray.push(new City(city.name, city.id));
        }
        this.cities = JSON.parse(data);
    }
    private async write(cities: City[]) {
        console.log(`cities in right function`, cities);
        return await fs.promises.writeFile('db/searchHistory.json', JSON.stringify(cities));
    }
    async getCities() {
        await this.read();
        return this.cities;
    }
    async addCity(city: string) {
        console.log(`city in addCity function`, city);
        await this.read();
        const newCity = new City(city, uuidv4());
        this.cities.push(newCity);
        await this.write(this.cities);
    }
    async removeCity(id: string) {
        await this.read();
        this.cities = this.cities.filter(city => city.id !== id);
        await this.write(this.cities);
    }
}
//   // ? TODO: Define a read method that reads from the searchHistory.json file
//   // ? TODO: Define a write method that writes the updated cities array to the searchHistory.json file
//   // ? TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
//   // ?TODO Define an addCity method that adds a city to the searchHistory.json file
//   // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
//   // async removeCity(id: string) {}
// }

export default new HistoryService();
