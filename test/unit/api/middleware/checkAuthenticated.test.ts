import { UserLoginService } from "@service/UserLoginService";
import { LoginResponse } from "@service/responses/LoginResponse";
import { UserRole } from "@db/entity/enum/UserRole";
import { checkAuthenticated } from "@api/middleware/checkAuthenticated";
import { getMockRequest, getMockResponse } from "../expressMocks";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Check Authentiction Middleware", () => {
  it("Successfully allows access to restricted endpoint with valid token", async () => {
    const expectedResponse = new LoginResponse(true, undefined, undefined, "TESTTOKEN", {
      id: 101,
      user: { firstName: "name" },
      userRole: UserRole.ADMIN,
      username: "admin",
    });

    const spy = jest.spyOn(UserLoginService.prototype, "loginWithToken").mockResolvedValue(expectedResponse);
    // First login to get a valid token
    const req = getMockRequest({ headers: { authorization: "Bearer BLAH" } });
    const res = getMockResponse();
    const next = jest.fn();

    await checkAuthenticated(req, res, next);

    expect(spy).toBeCalled();
    expect(next).toBeCalledTimes(1);
    expect(res.status).not.toBeCalled();
    expect(res.json).not.toBeCalled();
  });

  it("Returns a 401 with an invalid token", async () => {
    const expectedResponse = new LoginResponse(false, 401, undefined, "TESTTOKEN", {
      id: 101,
      user: { firstName: "name" },
      userRole: UserRole.ADMIN,
      username: "admin",
    });

    const spy = jest.spyOn(UserLoginService.prototype, "loginWithToken").mockResolvedValue(expectedResponse);
    // First login to get a valid token
    const req = getMockRequest({ headers: { authorization: "Bearer BLAH" } });
    const res = getMockResponse();
    const next = jest.fn();

    await checkAuthenticated(req, res, next);

    expect(spy).toBeCalled();
    expect(next).not.toBeCalled();
    expect(res.status).toBeCalled();
    expect(res.json).toBeCalled();
  });
});
