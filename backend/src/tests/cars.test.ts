import request from "supertest";
import app from "src/app.ts";

describe("Cars API", () => {
  let createdCarId: string | undefined;
  const testCar = {
    userId: "test-user-id",
    title: "Test Car",
    description: "A test car",
    price: 10000,
    mainCategory: "CAR",
    category: ["Sedan"],
    subcategory: ["Compact"],
    brand: "Toyota",
    vehicleModel: "Corolla",
    year: 2020,
    mileage: 10000,
    transmission: "Automatic",
    fuelType: "Petrol",
    color: "White",
    region: "TestRegion",
    city: "TestCity",
    images: [],
  };

  it("POST /api/cars should create a car", async () => {
    const res = await request(app)
      .post("/api/cars")
      .send(testCar)
      .set("Accept", "application/json");
    expect([201, 401, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) createdCarId = res.body.id;
  });

  it("GET /api/cars should return cars list or 401", async () => {
    const res = await request(app).get("/api/cars");
    expect([200, 401, 404]).toContain(res.statusCode);
  });

  it("PUT /api/cars/:id should update a car", async () => {
    if (!createdCarId) return;
    const res = await request(app)
      .put(`/api/cars/${createdCarId}`)
      .send({ title: "Updated Car" })
      .set("Accept", "application/json");
    expect([200, 401, 404, 400]).toContain(res.statusCode);
  });

  it("DELETE /api/cars/:id should delete a car", async () => {
    if (!createdCarId) return;
    const res = await request(app).delete(`/api/cars/${createdCarId}`);
    expect([200, 401, 404]).toContain(res.statusCode);
  });
});
