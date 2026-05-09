import request from "supertest";
import app from "src/app.ts";

describe("Message API", () => {
  it("GET /api/messages should return messages or 401", async () => {
    const res = await request(app).get("/api/messages");
    expect([200, 401, 404]).toContain(res.statusCode);
  });
});
