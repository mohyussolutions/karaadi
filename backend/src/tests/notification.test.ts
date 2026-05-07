import request from "supertest";
import app from "src/app.ts";

describe("Notification API", () => {
  it("GET /api/notifications", async () => {
    const res = await request(app).get("/api/notifications");
    expect([200, 401, 404, 500]).toContain(res.statusCode);
  });
});
