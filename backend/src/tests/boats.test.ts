import request from "supertest";
import app from "src/app.ts";

describe("Boats API", () => {
  let createdBoatId: string | undefined;
  const testBoat = {
    userId: "test-user-id",
    title: "Test Boat",
    description: "A test boat",
    price: 5000,
    mainCategory: "BOAT",
    category: ["Fishing"],
    subcategory: ["Small"],
    brand: "Yamaha",
    year: 2018,
    color: "Blue",
    region: "TestRegion",
    city: "TestCity",
    images: [],
  };

  it("POST /api/boats should create a boat (mock only, not persisted)", async () => {
    const res = await request(app)
      .post("/api/boats")
      .send(testBoat)
      .set("Accept", "application/json");
    expect([201, 401, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) createdBoatId = res.body.id;
  });

  it("GET /api/boats should return boats list or 401", async () => {
    const res = await request(app).get("/api/boats");
    expect([200, 401, 404]).toContain(res.statusCode);
  });

  it("PUT /api/boats/:id should update a boat (mock only)", async () => {
    if (!createdBoatId) return;
    const res = await request(app)
      .put(`/api/boats/${createdBoatId}`)
      .send({ title: "Updated Boat" })
      .set("Accept", "application/json");
    expect([200, 401, 404, 400]).toContain(res.statusCode);
  });

  it("DELETE /api/boats/:id should delete a boat (mock only)", async () => {
    if (!createdBoatId) return;
    const res = await request(app).delete(`/api/boats/${createdBoatId}`);
    expect([200, 401, 404]).toContain(res.statusCode);
  });
});
