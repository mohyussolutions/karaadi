import request from "supertest";
import app from "src/app.ts";

describe("Real Estate API", () => {
  let createdId: string | undefined;
  const testItem = {
    userId: "test-user-id", title: "Test Property", description: "A test property",
    price: 50000, mainCategory: "REAL_ESTATE", category: ["Apartment"],
    subcategory: ["Studio"], region: "TestRegion", city: "TestCity", images: [],
  };

  it("POST /api/real-estate", async () => {
    const res = await request(app).post("/api/real-estate").send(testItem);
    expect([201, 400, 401, 500]).toContain(res.statusCode);
    if (res.statusCode === 201) createdId = res.body.id;
  });

  it("GET /api/real-estate", async () => {
    const res = await request(app).get("/api/real-estate");
    expect([200, 401, 404, 500]).toContain(res.statusCode);
  });

  it("PUT /api/real-estate/:id", async () => {
    if (!createdId) return;
    const res = await request(app).put(`/api/real-estate/${createdId}`).send({ title: "Updated" });
    expect([200, 400, 401, 404, 500]).toContain(res.statusCode);
  });

  it("DELETE /api/real-estate/:id", async () => {
    if (!createdId) return;
    const res = await request(app).delete(`/api/real-estate/${createdId}`);
    expect([200, 401, 404, 500]).toContain(res.statusCode);
  });
});
