import { AnyOWEntity } from "@db/db";
import { OWEntity } from "@db/entity/OWEntity";
import { MockBaseDAO } from "@test/db/mock/MockBaseDAO";
import { TestData } from "@test/db/TestData";
import request from "supertest";
import { app } from "@api/app";
import { MockUserLoginDAO } from "@test/db/mock/MockUserLoginDAO";

jest.mock("@db/DAO/BaseDAO", () => {
  return {
    BaseDAO: jest.fn().mockImplementation((entityClass) => {
      return new MockBaseDAO(entityClass);
    }),
  };
});
jest.mock("@db/DAO/UserLoginDAO", () => {
  return {
    UserLoginDAO: jest.fn().mockImplementation(() => {
      return new MockUserLoginDAO();
    }),
  };
});

jest.mock("@db/db");

const testDataInstance = TestData.instance;
let token: string;
beforeAll(async () => {
  const userData = testDataInstance.userLogins[0];
  const req = request(app);
  const loginRes = await req.post("/api/v1/login").send({ username: userData.username, password: "TESTPASSWORD" });

  token = loginRes.body.token;
});

describe.each([
  ["/api/v1/currencies", testDataInstance.currencies, testDataInstance.generateCurrency.bind(testDataInstance)],
  ["/api/v1/institutions", testDataInstance.institutions, testDataInstance.generateInstitution.bind(testDataInstance)],
  ["/api/v1/accounts", testDataInstance.accounts, testDataInstance.generateAccount.bind(testDataInstance)],
  ["/api/v1/transactions", testDataInstance.transactions, testDataInstance.generateTransaction.bind(testDataInstance)],
  // ["/api/v1/users", testData.users, testData.generateUser.bind(testData)],
])(`Basic CRUD Functions for %p`, (apiEndpoint: string, testData: OWEntity[], entityGenerator: () => AnyOWEntity) => {
  it("Can retrieve all entities", async () => {
    const req = request(app);
    const res = await req.get(apiEndpoint).auth(token, { type: "bearer" }).send();

    const entity = JSON.parse(JSON.stringify(testData[0]));

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.entities?.length).toBeGreaterThan(0);
    expect(res.body.entities?.[0]).toEqual(entity);
  });

  it(`Can retrieve an entity by it's ID`, async () => {
    const req = request(app);
    const entity = JSON.parse(JSON.stringify(testData[0]));

    const res = await req
      .get(`${apiEndpoint}/${entity.id ?? 0}`)
      .auth(token, { type: "bearer" })
      .send();

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.entities?.[0]).toEqual(entity);
  });

  it("Can save an entity, then retrieve it", async () => {
    const req = request(app);
    const entity = JSON.parse(JSON.stringify(entityGenerator()));

    const saveResponse = await req.put(apiEndpoint).auth(token, { type: "bearer" }).send(entity);
    const fetchResponse = await req
      .get(`${apiEndpoint}/${entity.id ?? 0}`)
      .auth(token, { type: "bearer" })
      .send();

    expect(saveResponse.status).toBe(201);
    expect(saveResponse.body.success).toBe(true);
    expect(saveResponse.body.entities?.[0]).toEqual(entity);

    expect(fetchResponse.status).toBe(200);
    expect(fetchResponse.body.success).toBe(true);
    expect(fetchResponse.body.entities?.[0]).toEqual(entity);
  });

  it("Can delete a given entity using it's ID", async () => {
    const req = request(app);
    const entity = JSON.parse(JSON.stringify(testData[0]));

    const deleteResponse = await req
      .delete(`${apiEndpoint}/${entity.id ?? 0}`)
      .auth(token, { type: "bearer" })
      .send();
    const fetchResponse = await req
      .get(`${apiEndpoint}/${entity.id ?? 0}`)
      .auth(token, { type: "bearer" })
      .send();

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.success).toBe(true);
    expect(deleteResponse.body.entities?.[0]).toEqual(entity);

    expect(fetchResponse.status).toBe(404);
    expect(fetchResponse.body.success).toBe(false);
    expect(fetchResponse.body.entities?.length).toBe(0);
    expect(fetchResponse.body.errorCode).toBe(404);
    expect(fetchResponse.body.errorMessage).not.toBeNull();
  });
});
