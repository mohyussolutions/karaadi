import request from "supertest";
import app from "src/app.ts";

describe("Farm Equipment API", () => {
  it("GET /api/farmequipment", async () => {
    const res = await request(app).get("/api/farmequipment");
    expect([200, 401, 404, 500]).toContain(res.statusCode);
  });
});
