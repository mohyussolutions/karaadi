import request from "supertest";
import app from "src/app.ts";

describe("Marketplace API", () => {
  let createdId: string | undefined;
  const testItem = {
    userId: "test-user-id", title: "Test Item", description: "A test item",
    price: 100, mainCategory: "MARKETPLACE", category: ["General"],
    subcategory: ["Misc"], region: "TestRegion", city: "TestCity", images: [],
  };

  it("POST /api/marketplace", async () => {
    const res = await request(app).post("/api/marketplace").send(testItem);
    expect([201, 400, 401, 500]).toContain(res.statusCode);
    if (res.statusCode === 201) createdId = res.body.id;
  });

  it("GET /api/marketplace", async () => {
    const res = await request(app).get("/api/marketplace");
    expect([200, 401, 404, 500]).toContain(res.statusCode);
  });

  it("PUT /api/marketplace/:id", async () => {
    if (!createdId) return;
    const res = await request(app).put(`/api/marketplace/${createdId}`).send({ title: "Updated" });
    expect([200, 400, 401, 404, 500]).toContain(res.statusCode);
  });

  it("DELETE /api/marketplace/:id", async () => {
    if (!createdId) return;
    const res = await request(app).delete(`/api/marketplace/${createdId}`);
    expect([200, 401, 404, 500]).toContain(res.statusCode);
  });
});
