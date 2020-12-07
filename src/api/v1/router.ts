import { BaseRouter } from "@api/BaseRouter";
import { LoginRouter } from "@api/v1/login/router";

export class ApiV1Router extends BaseRouter {
  protected initRoutes(): void {
    this.router.use("/login", new LoginRouter().router);
  }
}
