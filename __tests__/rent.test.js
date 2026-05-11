import request from "supertest";
import app from '../server.js';
import { db } from "../config/db.js";

// Mock temporal para simular autenticación
app.use((req, res, next) => {
  req.user = { id: 1 }; // usuario ficticio con ID 1
  next();
});

describe("API de rentas", () => {
  const movieId = 1; // 👈 una película existente en tu DB

  test("debería registrar una renta correctamente", async () => {
    const res = await request(app)
      .post("/api/rents")
      .send({ movieId }); // ✅ coincide con tu controlador

    console.log("📤 Respuesta del servidor:", res.statusCode, res.body);
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("message");
  });

  test("debería obtener las rentas del usuario", async () => {
    const res = await request(app).get("/api/rents/user/1");

    console.log("📥 Rentas del usuario:", res.statusCode);
    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

});
