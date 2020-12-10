import { AdminOnly } from "@api/middleware/adminOnlyDecorator";
import { UserRole } from "@db/entity/enum/UserRole";
import { Request, Response } from "express";
import { getMockRequest, getMockResponse } from "../expressMocks";

class TestClass {
  @AdminOnly()
  testFunction(functionToCall: () => void) {
    functionToCall();
  }

  @AdminOnly()
  testRequestHandler(req: Request, res: Response) {
    res.status(200);
  }
}
describe("Admin Only Decorator Functionality", () => {
  it("Successfully calls the underlying function if requested by an admin", () => {
    const testClass = new TestClass();
    const req = getMockRequest({
      user: { userRole: UserRole.ADMIN, id: 1, user: { firstName: "test" }, username: "test" },
    });
    const res = getMockResponse();

    testClass.testRequestHandler(req, res);

    expect(res.status).toBeCalledWith(200);
  });

  it("Blocks requests (with status 401) for non-admin users", () => {
    const testClass = new TestClass();
    const req = getMockRequest({
      user: { userRole: UserRole.STANDARD, id: 1, user: { firstName: "test" }, username: "test" },
    });
    const res = getMockResponse();

    testClass.testRequestHandler(req, res);

    expect(res.status).toBeCalledWith(401);
  });

  it("Throws an error when used on a function that does not have req/res defined as args", () => {
    const testClass = new TestClass();
    const mockFunction = jest.fn();

    expect(() => {
      testClass.testFunction(mockFunction);
    }).toThrowError();
    expect(mockFunction).not.toBeCalled();
  });
});
