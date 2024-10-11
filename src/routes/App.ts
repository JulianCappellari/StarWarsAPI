import { Router } from "express";
import { getPeople } from "../controllers/peopleController";
import { getFilms } from "../controllers/filmsController";
import { getStarships } from "../controllers/startshipsControllers";
import { getPlanets } from "../controllers/planetsController";



const router = Router();

router.get("/people", getPeople);

router.get("/films", getFilms);

router.get("/starships", getStarships);

router.get("/planets", getPlanets);

export default router;
