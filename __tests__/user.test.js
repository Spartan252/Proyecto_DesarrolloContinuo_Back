import request from "supertest";
import app from "../server.js";
import { db } from "../config/db.js";

describe("API de usuarios", () => {
  beforeEach(async () => {
    // elimina el usuario si existe para evitar conflicto
    await db.query("DELETE FROM users WHERE email = 'usertest@test.com'");
  });

  it("debería registrar un usuario correctamente", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({
        nombre: "UserTest",
        email: "usertest@test.com",
        password: "1234",
      })
      .set("Accept", "application/json");

    console.log("📤 Respuesta del servidor:", res.statusCode, res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

  it("debería rechazar un registro sin datos", async () => {
    const res = await request(app).post("/api/users/register").send({});
    expect(res.statusCode).toBe(400);
  });
});
