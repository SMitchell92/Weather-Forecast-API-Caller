import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';

import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  try {
    const weatherQuery = await WeatherService.getWeatherForCity(req.body.cityName);
    await HistoryService.addCity(req.body.cityName);
    res.status(200).json(weatherQuery);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json(error)
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.status(200).json(cities);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json(error)
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    await HistoryService.removeCity(req.params.id);
    res.status(200).json("Delete request placeholder");
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json(error)
  }
});

export default router;
