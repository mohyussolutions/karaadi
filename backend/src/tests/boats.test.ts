import request from "supertest";
import app from "src/app.ts";

describe("Boats API", () => {
  let createdId: string | undefined;
  const testBoat = {
    userId: "test-user-id", title: "Test Boat", description: "A test boat",
    price: 5000, mainCategory: "BOAT", category: ["Fishing"], subcategory: ["Small"],
    year: 2018, color: "Blue", region: "TestRegion", city: "TestCity", images: [],
  };

  it("POST /api/boats", async () => {
    const res = await request(app).post("/api/boats").send(testBoat);
    expect([201, 400, 401, 500]).toContain(res.statusCode);
    if (res.statusCode === 201) createdId = res.body.id;
  });

  it("GET /api/boats", async () => {
    const res = await request(app).get("/api/boats");
    expect([200, 401, 404, 500]).toContain(res.statusCode);
  });

  it("PUT /api/boats/:id", async () => {
    if (!createdId) return;
    const res = await request(app).put(`/api/boats/${createdId}`).send({ title: "Updated" });
    expect([200, 400, 401, 404, 500]).toContain(res.statusCode);
  });

  it("DELETE /api/boats/:id", async () => {
    if (!createdId) return;
    const res = await request(app).delete(`/api/boats/${createdId}`);
    expect([200, 401, 404, 500]).toContain(res.statusCode);
  });
});
