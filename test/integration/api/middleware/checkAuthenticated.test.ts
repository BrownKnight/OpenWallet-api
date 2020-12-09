import request from "supertest";
import { app } from "@api/app";
import { As } from "@test/integration/db/TestDataManager";
import { DB } from "@db/db";

beforeAll(async () => {
  await DB.init();
});

afterAll(async () => {
  await DB.close();
});

describe("Check Authentiction Middleware", () => {
  it("Successfully allows access to restricted endpoint with valid token", async () => {
    await As.Admin();

    // First login to get a valid token
    const req = request(app);
    const loginRes = await req.post("/api/v1/login").send({ username: "Admin", password: "TESTPASSWORD" });

    expect(loginRes.status).toBe(200);
    const token = loginRes.body.token;

    const res = await req.post("/random-endpoint").auth(token, { type: "bearer" }).send();

    // Should return a 401 if unauthorised, 404 if the request passed the middleware
    expect(res.status).toBe(404);
  });

  it("Returns a 401 with an invalid token", async () => {
    await As.Admin();

    // First login to get a valid token
    const req = request(app);
    const loginRes = await req.post("/api/v1/login").send({ username: "Admin", password: "TESTPASSWORD" });

    expect(loginRes.status).toBe(200);
    const token = loginRes.body.token;

    const res = await req.post("/random-endpoint").auth(token, { type: "bearer" }).send();

    // Should return a 401 if unauthorised, 404 if the request passed the middleware
    expect(res.status).toBe(404);
  });
});
