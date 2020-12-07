import { UserRole } from "@db/entity/enum/UserRole";
import { ServiceResponse } from "@service/responses/ServiceResponse";
import { Request, Response } from "express";

/**
 * When a request handler is decorated with the AdminOnly decorator, it will ensure that it is only executed if the
 * current user in the request in an admin. If they are not an admin, it will return a 401.
 */
export function AdminOnly() {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = function (...args: any[]) {
      let req: Request | undefined;
      let res: Response | undefined;
      if (args && args.length >= 2) {
        req = args[0];
        res = args[1];
      }

      if (!req || !res) {
        throw new Error("Unexpected Error occurred, req/res is not defined in handler");
      }

      if ("user" in req) {
        if (req.user?.userRole === UserRole.ADMIN) {
          // User is an admin, so continue with the execution of the original method
          originalMethod.apply(this, args);
        } else {
          console.error(
            `Unauthorised (i.e standard) user ${req.user?.id} ${req.user?.username} attempted to access ${req.originalUrl}`
          );
          res
            .status(401)
            .json(new ServiceResponse(false, [], undefined, 401, "Not authorized for this Admin-only endpoint"));
        }
      } else {
        res
          .status(500)
          .json(
            new ServiceResponse(false, [], undefined, 500, "Unexpected error, user object not injected into request")
          );
        throw new Error("User object is not defined in request, is the authMiddleware working correctly?");
      }
    };
  };
}
