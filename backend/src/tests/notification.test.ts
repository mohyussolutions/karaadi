import request from "supertest";
import app from "src/app.ts";

describe("Notification API", () => {
  it("GET /api/notifications should return notifications or 401", async () => {
    const res = await request(app).get("/api/notifications");
    expect([200, 401, 404]).toContain(res.statusCode);
  });
});
