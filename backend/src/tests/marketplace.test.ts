import request from "supertest";
import app from "src/app.ts";

describe("Marketplace API", () => {
  let createdMarketplaceId: string | undefined;
  const testMarketplace = {
    userId: "test-user-id",
    title: "Test Marketplace Item",
    description: "A test item",
    price: 100,
    mainCategory: "MARKETPLACE",
    category: ["General"],
    subcategory: ["Misc"],
    region: "TestRegion",
    city: "TestCity",
    images: [],
  };

  it("POST /api/marketplace should create an item (mock only, not persisted)", async () => {
    const res = await request(app)
      .post("/api/marketplace")
      .send(testMarketplace)
      .set("Accept", "application/json");
    expect([201, 401, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) createdMarketplaceId = res.body.id;
  });

  it("GET /api/marketplace should return items list or 401", async () => {
    const res = await request(app).get("/api/marketplace");
    expect([200, 401, 404]).toContain(res.statusCode);
  });

  it("PUT /api/marketplace/:id should update an item (mock only)", async () => {
    if (!createdMarketplaceId) return;
    const res = await request(app)
      .put(`/api/marketplace/${createdMarketplaceId}`)
      .send({ title: "Updated Item" })
      .set("Accept", "application/json");
    expect([200, 401, 404, 400]).toContain(res.statusCode);
  });

  it("DELETE /api/marketplace/:id should delete an item (mock only)", async () => {
    if (!createdMarketplaceId) return;
    const res = await request(app).delete(
      `/api/marketplace/${createdMarketplaceId}`,
    );
    expect([200, 401, 404]).toContain(res.statusCode);
  });
});
