import { MockUserLoginDAO } from "@test/db/mock/MockUserLoginDAO";
import request from "supertest";
import { app } from "@api/app";
import { TestData } from "@test/db/TestData";

jest.mock("@db/DAO/UserLoginDAO", () => {
  return {
    UserLoginDAO: jest.fn().mockImplementation(() => {
      return new MockUserLoginDAO();
    }),
  };
});
jest.mock("@db/db");

describe("Check Authentiction Middleware", () => {
  it("Successfully allows access to restricted endpoint with valid token", async () => {
    // First login to get a valid token
    const userData = TestData.instance.userLogins[0];
    const req = request(app);
    const loginRes = await req.post("/api/v1/login").send({ username: userData.username, password: "TESTPASSWORD" });

    expect(loginRes.status).toBe(200);
    const token = loginRes.body.token;

    const res = await req.post("/random-endpoint").auth(token, { type: "bearer" }).send();

    // Should return a 401 if unauthorised, 404 is the request passed the middleware
    expect(res.status).toBe(404);
  });

  it("Returns a 401 with an invalid token", async () => {
    const req = request(app);
    const res = await req.post("/random-endpoint").auth("INVALID", { type: "bearer" }).send();

    expect(res.status).toBe(401);
  });
});
