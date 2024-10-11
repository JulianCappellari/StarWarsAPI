it("should return a 500 error if there is a database error", async () => {
    // Simular un error en la base de datos
    (Films.find as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    const req = { query: { page: "1", limit: "10" } } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getFilms(req, res);

    // Verifica que se estableció un estado 500 en caso de error en la base de datos
    expect(res.status).toHaveBeenCalledWith(500);
    // Verifica que se devolvió el mensaje de error adecuado
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });

  it("should return 502 if the external API request fails", async () => {
    // Simular que la búsqueda en la base de datos no encuentra resultados
    (Films.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),
      }),
    });

    // Mockear que la API externa falla
    (axios.get as jest.Mock).mockRejectedValue(new Error("API request failed"));

    const req = { query: { page: "1", limit: "10" } } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getFilms(req, res);

    // Verifica que se devuelve un código 502 por error de la API
    expect(res.status).toHaveBeenCalledWith(502);
    // Verifica que el mensaje de error es devuelto en el JSON
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching films from external API",
    });
  });
  it("should return 404 if no films are found in the database or external API", async () => {
    // Simular que no hay películas en la base de datos
    (Films.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),
      }),
    });

    // Simular que la API externa devuelve un array vacío
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        results: [],
      },
    });

    const req = { query: { page: "1", limit: "10" } } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getFilms(req, res);

    // Verifica que se devuelve un código 404
    expect(res.status).toHaveBeenCalledWith(404);
    // Verifica que el mensaje de error es devuelto en el JSON
    expect(res.json).toHaveBeenCalledWith({ message: "No films found" });
  });