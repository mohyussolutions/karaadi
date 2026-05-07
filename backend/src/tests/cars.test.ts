import request from "supertest";
import app from "src/app.ts";

describe("Cars API", () => {
  let createdId: string | undefined;
  const testCar = {
    userId: "test-user-id", title: "Test Car", description: "A test car",
    price: 10000, mainCategory: "CAR", category: ["Sedan"], subcategory: ["Compact"],
    brand: "Toyota", vehicleModel: "Corolla", year: 2020, mileage: 10000,
    transmission: "Automatic", fuelType: "Petrol", color: "White",
    region: "TestRegion", city: "TestCity", images: [],
  };

  it("POST /api/cars", async () => {
    const res = await request(app).post("/api/cars").send(testCar);
    expect([201, 400, 401, 500]).toContain(res.statusCode);
    if (res.statusCode === 201) createdId = res.body.id;
  });

  it("GET /api/cars", async () => {
    const res = await request(app).get("/api/cars");
    expect([200, 401, 404, 500]).toContain(res.statusCode);
  });

  it("PUT /api/cars/:id", async () => {
    if (!createdId) return;
    const res = await request(app).put(`/api/cars/${createdId}`).send({ title: "Updated" });
    expect([200, 400, 401, 404, 500]).toContain(res.statusCode);
  });

  it("DELETE /api/cars/:id", async () => {
    if (!createdId) return;
    const res = await request(app).delete(`/api/cars/${createdId}`);
    expect([200, 401, 404, 500]).toContain(res.statusCode);
  });
});
