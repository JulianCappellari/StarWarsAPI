import { Router } from "express";
import { getPeople } from "../controllers/peopleController";
import { getFilms } from "../controllers/filmsController";
import { getPlanets } from "../controllers/planetsController";

import { getStarship } from "../controllers/startshipsControllers";
import { middlewareValidator } from "../middleware/middlewareValidator";


const router = Router();

/**
 * @swagger
 * /api/people:
 *   get:
 *     summary: Obtener personas
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Nombre de la persona
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Número de página
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Número de resultados por página
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Lista de personas
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.get("/people",  middlewareValidator,getPeople);


/**
 * @swagger
 * /api/films:
 *   get:
 *     summary: Obtener películas
 *     parameters:
 *       - name: title
 *         in: query
 *         description: Título de la película
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Número de página
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Número de resultados por página
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Lista de películas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de películas
 *                 currentPage:
 *                   type: integer
 *                   description: Página actual
 *                 films:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       episode_id:
 *                         type: integer
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.get("/films", middlewareValidator,getFilms);

/**
 * @swagger
 * /api/starships:
 *   get:
 *     summary: Obtener naves estelares
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Nombre de la nave estelar
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Número de página
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Número de resultados por página
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Lista de naves estelares
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de naves estelares
 *                 currentPage:
 *                   type: integer
 *                   description: Página actual
 *                 totalPages:
 *                   type: integer
 *                   description: Total de páginas
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       model:
 *                         type: string
 *                       manufacturer:
 *                         type: string
 *                       cost_in_credits:
 *                         type: string
 *                       length:
 *                         type: string
 *                       max_atmosphering_speed:
 *                         type: string
 *                       crew:
 *                         type: string
 *                       passengers:
 *                         type: string
 *                       cargo_capacity:
 *                         type: string
 *                       consumables:
 *                         type: string
 *                       hyperdrive_rating:
 *                         type: string
 *                       MGLT:
 *                         type: string
 *                       starship_class:
 *                         type: string
 *                       pilots:
 *                         type: array
 *                         items:
 *                           type: string
 *                       films:
 *                         type: array
 *                         items:
 *                           type: string
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.get("/starships", middlewareValidator, getStarship);


/**
 * @swagger
 * /api/planets:
 *   get:
 *     summary: Obtener planetas
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Nombre del planeta
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Número de página
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Número de resultados por página
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Lista de planetas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de planetas
 *                 currentPage:
 *                   type: integer
 *                   description: Página actual
 *                 totalPages:
 *                   type: integer
 *                   description: Total de páginas
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       rotation_period:
 *                         type: string
 *                       orbital_period:
 *                         type: string
 *                       diameter:
 *                         type: string
 *                       climate:
 *                         type: string
 *                       gravity:
 *                         type: string
 *                       terrain:
 *                         type: string
 *                       surface_water:
 *                         type: string
 *                       population:
 *                         type: string
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.get("/planets", middlewareValidator, getPlanets);

export default router;
