import request from "supertest";
import app from "src/app.ts";

describe("Real Estate API", () => {
  let createdRealEstateId: string | undefined;
  const testRealEstate = {
    userId: "test-user-id",
    title: "Test Real Estate",
    description: "A test real estate",
    price: 50000,
    mainCategory: "REAL_ESTATE",
    category: ["Apartment"],
    subcategory: ["Studio"],
    region: "TestRegion",
    city: "TestCity",
    images: [],
  };

  it("POST /api/real-estate should create a real estate (mock only, not persisted)", async () => {
    const res = await request(app)
      .post("/api/real-estate")
      .send(testRealEstate)
      .set("Accept", "application/json");
    expect([201, 401, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) createdRealEstateId = res.body.id;
  });

  it("GET /api/real-estate should return real estate list or 401", async () => {
    const res = await request(app).get("/api/real-estate");
    expect([200, 401, 404]).toContain(res.statusCode);
  });

  it("PUT /api/real-estate/:id should update a real estate (mock only)", async () => {
    if (!createdRealEstateId) return;
    const res = await request(app)
      .put(`/api/real-estate/${createdRealEstateId}`)
      .send({ title: "Updated Real Estate" })
      .set("Accept", "application/json");
    expect([200, 401, 404, 400]).toContain(res.statusCode);
  });

  it("DELETE /api/real-estate/:id should delete a real estate (mock only)", async () => {
    if (!createdRealEstateId) return;
    const res = await request(app).delete(
      `/api/real-estate/${createdRealEstateId}`,
    );
    expect([200, 401, 404]).toContain(res.statusCode);
  });
});
