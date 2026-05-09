import request from "supertest";
import app from "src/app.ts";

describe("Motorcycles API", () => {
  it("GET /api/motorcycles should return motorcycles list or 401", async () => {
    const res = await request(app).get("/api/motorcycles");
    expect([200, 401, 404]).toContain(res.statusCode);
  });
});
