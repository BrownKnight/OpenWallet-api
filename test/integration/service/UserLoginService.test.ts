import { UserLoginService } from "@service/UserLoginService";
import { DB } from "@db/db";
import { As } from "../db/TestDataManager";
import { UserLogin } from "@db/entity/UserLogin";

beforeAll(async () => {
  await DB.init();
});

afterAll(async () => {
  await DB.close();
});

describe("User Login Service", () => {
  it("allows a successful login with the correct username/password", async () => {
    const service = new UserLoginService();
    const validUserLogin = (await As.Admin()).getData(UserLogin)[0];

    const loginResponse = await service.login(validUserLogin.username, "TESTPASSWORD" as string);

    expect(loginResponse).not.toBeNull();
    expect(loginResponse.success).toBe(true);
    expect(loginResponse.errorCode).not.toBeDefined();
    expect(loginResponse.token).not.toBeFalsy();
  });

  it("successfully verifies a good token", async () => {
    const service = new UserLoginService();
    const validUserLogin = (await As.Admin()).getData(UserLogin)[0];

    const loginResponse = await service.login(validUserLogin.username, "TESTPASSWORD" as string);

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
    const validUserLogin = (await As.Admin()).getData(UserLogin)[0];
    const invalidUserLogin = { ...validUserLogin, password: "INVALID" };

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
