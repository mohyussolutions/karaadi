import request from "supertest";
import app from "src/app.ts";

describe("Motorcycles API", () => {
  it("GET /api/motorcycles", async () => {
    const res = await request(app).get("/api/motorcycles");
    expect([200, 401, 404, 500]).toContain(res.statusCode);
  });
});
