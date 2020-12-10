import request from "supertest";
import { app } from "@api/app";
import { DB } from "@db/db";
import { As } from "@test/integration/db/TestDataManager";

beforeAll(async () => {
  await DB.init();
});

afterAll(async () => {
  await DB.close();
});

describe("Login API functionality", () => {
  it("Successfully returns a token with valid credentials", async () => {
    await As.Admin();

    const req = request(app);
    const res = await req.post("/api/v1/login").send({ username: "Admin", password: "TESTPASSWORD" });
    expect(res.status).toBe(200);
    expect(res.body.token).not.toBeFalsy();
  });

  it("Returns a 401 with invalid credentials", async () => {
    await As.Admin();

    const req = request(app);
    const res = await req.post("/api/v1/login").send({ username: "INVALID", password: "INVALID" });

    expect(res.status).toBe(401);
    expect(res.body.token).toBeFalsy();
  });
});
