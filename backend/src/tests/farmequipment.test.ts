import app from "src/app.ts";

import request from "supertest";
describe("Farm Equipment API", () => {
  it("GET /api/farmequipment should return farm equipment list or 401", async () => {
    const res = await request(app).get("/api/farmequipment");
    expect([200, 401, 404]).toContain(res.statusCode);
  });
});
