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

describe("Login API functionality", () => {
  it("Successfully returns a token with valid credentials", async () => {
    const userData = TestData.instance.userLogins[0];
    const req = request(app);
    const res = await req.post("/api/v1/login").send({ username: userData.username, password: "TESTPASSWORD" });

    expect(res.status).toBe(200);
  });

  it("Returns a 401 with invalid credentials", async () => {
    const req = request(app);
    const res = await req.post("/api/v1/login").send({ username: "INVALID", password: "INVALID" });

    expect(res.status).toBe(401);
  });
});
