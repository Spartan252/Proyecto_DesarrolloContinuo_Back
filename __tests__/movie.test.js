import request from "supertest";
import app from '../server.js';
import { db } from "../config/db.js";

describe("API de películas", () => {
  beforeEach(async () => {
    // limpiar película de prueba
    await db.query("DELETE FROM peliculas WHERE titulo = 'Pelicula Test'");
  });

  it("debería registrar una película correctamente", async () => {
    const res = await request(app)
      .post("/api/movies")
      .send({
        titulo: "Pelicula Renta",
        genero: "Test",
        descripcion: "Película para prueba de renta",
        portada_url: "TEST"

      });

    console.log("📤 Respuesta del servidor:", res.statusCode, res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Película creada correctamente");
  });

  it("debería obtener el listado de películas", async () => {
    const res = await request(app).get("/api/movies");
    console.log("📥 Listado de películas:", res.statusCode);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });


});
