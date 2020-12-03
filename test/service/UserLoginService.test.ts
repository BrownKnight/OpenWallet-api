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
});
