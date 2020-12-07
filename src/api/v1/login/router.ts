import { BaseRouter } from "@api/BaseRouter";
import { LoginResponse } from "@service/responses/LoginResponse";
import { UserLoginService } from "@service/UserLoginService";
import { Request, Response } from "express";

export class LoginRouter extends BaseRouter {
  protected initRoutes(): void {
    this.router.post("/", this.handleLogin.bind(this));
  }

  private async handleLogin(req: Request, res: Response) {
    const body = req.body;
    if (!body || !body.username || !body.password) {
      res.status(400).json(new LoginResponse(false, 400, "Invalid Body in Request"));
      return;
    }

    const loginService = new UserLoginService();
    const loginResponse = await loginService.login(body.username, body.password);

    res.status(loginResponse.errorCode ?? 200).json(loginResponse);
  }
}
