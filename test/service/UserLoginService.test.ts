import { UserLoginService } from "@service/UserLoginService";
import { MockUserLoginDAO } from "@test/db/mock/MockUserLoginDAO";
import { TestData } from "@test/db/TestData";

jest.mock("@db/DAO/UserLoginDAO", () => {
  return {
    UserLoginDAO: jest.fn().mockImplementation(() => {
      return new MockUserLoginDAO();
    }),
  };
});

describe("User Login Service", () => {
  it("allows a successful login with the correct username/password", async () => {
    const service = new UserLoginService();
    const validUserLogin = { ...TestData.instance.userLogins[0], password: "TESTPASSWORD" };

    const loginResponse = await service.login(validUserLogin.username, validUserLogin.password as string);

    expect(loginResponse).not.toBeNull();
    expect(loginResponse.success).toBe(true);
    expect(loginResponse.errorCode).not.toBeDefined();
    expect(loginResponse.token).not.toBeFalsy();
  });

  it("successfully verifies a good token", async () => {
    const service = new UserLoginService();
    const validUserLogin = { ...TestData.instance.userLogins[0], password: "TESTPASSWORD" };

    const loginResponse = await service.login(validUserLogin.username, validUserLogin.password as string);

    expect(loginResponse).not.toBeNull();
    expect(loginResponse.success).toBe(true);
    expect(loginResponse.errorCode).not.toBeDefined();
    expect(loginResponse.token).not.toBeFalsy();

    const tokenLoginResponse = await service.loginWithToken(loginResponse.token as string);
    expect(tokenLoginResponse).not.toBeNull();
    expect(tokenLoginResponse.success).toBe(true);
    expect(tokenLoginResponse.errorCode).not.toBeDefined();
    expect(tokenLoginResponse.token).not.toBeFalsy();
    expect(tokenLoginResponse.user).toBeDefined();
  });

  it("rejects a login with an incorrect username", async () => {
    const service = new UserLoginService();
    const invalidUserLogin = { username: "INVALID", password: "TESTPASSWORD" };

    const loginResponse = await service.login(invalidUserLogin.username, invalidUserLogin.password as string);

    expect(loginResponse).not.toBeNull();
    expect(loginResponse.success).toBe(false);
    expect(loginResponse.errorCode).toBe(401);
    expect(loginResponse.token).not.toBeDefined();
  });

  it("rejects a login with an incorrect password", async () => {
    const service = new UserLoginService();
    const invalidUserLogin = { ...TestData.instance.userLogins[0], password: "INVALID" };

    const loginResponse = await service.login(invalidUserLogin.username, invalidUserLogin.password as string);

    expect(loginResponse).not.toBeNull();
    expect(loginResponse.success).toBe(false);
    expect(loginResponse.errorCode).toBe(401);
    expect(loginResponse.token).not.toBeDefined();
  });

  it("rejects a bad token", async () => {
    const service = new UserLoginService();

    const tokenLoginResponse = await service.loginWithToken("INVALID");
    expect(tokenLoginResponse).not.toBeNull();
    expect(tokenLoginResponse.success).toBe(false);
    expect(tokenLoginResponse.errorCode).toBe(401);
    expect(tokenLoginResponse.token).not.toBeDefined();
    expect(tokenLoginResponse.user).not.toBeDefined();
  });
});

describe("User Login Service CRUD Operations", () => {
  it("Can retrieve all user logins", async () => {
    const service = new UserLoginService();
    const response = await service.getAll();

    expect(response).not.toBeNull();
    expect(response.success).toBe(true);
    expect(response.entities?.length).toBeGreaterThan(0);
    expect(response.entities?.[0]).toEqual(TestData.instance.userLogins[0]);
  });

  it(`Can retrieve an user login by it's ID`, async () => {
    const service = new UserLoginService();
    const entity = TestData.instance.userLogins[0];

    const response = await service.getById(entity.id ?? 0);

    delete entity.password;
    delete entity.webToken;

    expect(response).not.toBeNull();
    expect(response.success).toBe(true);
    expect(response.entities?.[0]).toEqual(entity);
  });

  it("Can save an user login, then retrieve it", async () => {
    const service = new UserLoginService();
    const entity = TestData.instance.generateUserLogin();

    const saveResponse = await service.save(entity);
    const fetchResponse = await service.getById(entity.id ?? 0);

    delete entity.password;
    delete entity.webToken;

    expect(saveResponse).not.toBeNull();
    expect(saveResponse.success).toBe(true);
    expect(saveResponse.entities?.[0]).toEqual(entity);

    expect(fetchResponse).not.toBeNull();
    expect(fetchResponse.success).toBe(true);
    expect(fetchResponse.entities?.[0]).toEqual(entity);
  });

  it("Can delete a given user login using it's ID", async () => {
    const service = new UserLoginService();
    const entity = TestData.instance.userLogins[0];

    const deleteResponse = await service.deleteById(entity.id ?? 0);
    const fetchResponse = await service.getById(entity.id ?? 0);

    delete entity.password;
    delete entity.webToken;

    expect(deleteResponse).not.toBeNull();
    expect(deleteResponse.success).toBe(true);
    expect(deleteResponse.entities?.[0]).toEqual(entity);

    expect(fetchResponse).not.toBeNull();
    expect(fetchResponse.success).toBe(false);
    expect(fetchResponse.errorCode).toBe(404);
    expect(fetchResponse.errorMessage).not.toBeNull();
    expect(fetchResponse.entities?.length).toBe(0);
  });
});
