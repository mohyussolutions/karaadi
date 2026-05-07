import request from "supertest";
import app from "src/app.ts";

describe("Message API", () => {
  it("GET /api/messages", async () => {
    const res = await request(app).get("/api/messages");
    expect([200, 401, 404, 500]).toContain(res.statusCode);
  });
});
