# Star Wars API - Backend

Este proyecto implementa una RESTful API para sincronizar y gestionar información de la API de Star Wars, utilizando **Node.js**, **TypeScript** y **MongoDB**. Los datos de las entidades `People`, `Films`, `Starships` y `Planets` se sincronizan automáticamente a intervalos regulares y se almacenan en una base de datos MongoDB para su consulta.

## Características Principales

- **Sincronización automática**: La información de Star Wars se sincroniza periódicamente desde la API pública.
- **Endpoints robustos**: Cada entidad tiene endpoints para listar, filtrar y obtener detalles específicos.
- **Paginación y filtros**: Implementación de paginación y búsqueda por atributos como nombre, género, etc.
- **Base de datos MongoDB**: Toda la información está almacenada y gestionada con MongoDB mediante Mongoose ODM.
- **Tests unitarios**: Los endpoints y funcionalidades clave están cubiertos por tests.
- **Documentación con Swagger**: La API está documentada utilizando Swagger UI para facilitar el uso y prueba de los endpoints.
- **Despliegue en Railway**: El backend está desplegado en Railway para acceso en producción.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para construir la API.
- **TypeScript**: Tipado estático para mejorar la calidad y escalabilidad del código.
- **Express**: Framework para la construcción de la API.
- **MongoDB**: Base de datos NoSQL para almacenar las entidades de Star Wars.
- **Mongoose**: ODM para gestionar y modelar los datos en MongoDB.
- **Cron Jobs**: Configuración de tareas automáticas para sincronizar datos.
- **Jest**: Framework de pruebas unitarias.
- **Swagger UI**: Herramienta para generar y visualizar la documentación de la API.

## Endpoints

Puedes acceder a los endpoints de la API desde la siguiente URL:

https://starwarsapi-xop3.onrender.com/api

Cada entidad cuenta con su propio endpoint. Para consultar una lista o realizar búsquedas, puedes utilizar las rutas correspondientes:

- **People**: /api/people (filtro: name)
- **Films**: /api/films (filtro: title)
- **Starships**: /api/starships (filtro: name)
- **Planets**: /api/planets (filtros: name)


## Documentación de la API
Puedes acceder a la documentación completa de la API en Swagger UI visitando:
https://starwarsapi-xop3.onrender.com/api-docs
