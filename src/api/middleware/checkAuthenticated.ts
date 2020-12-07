import { UserLoginService } from "@service/UserLoginService";
import { Request, Response } from "express";
import moment from "moment";

export async function checkAuthenticated(req: Request, res: Response, next: () => void): Promise<void> {
  if (process.env.NODE_ENV === "production")
    console.log(`Incoming request for ${req.path} at ${moment().format("DD/MM HH:mm:ss")}`);

  // If trying to access pages that don't require auth, then skip auth check
  if (req.path.startsWith("/api/v1/login") || req.path.startsWith("/api/docs")) {
    next();
    return;
  }

  // Get the JWT token the request is authorised with
  const token = req.headers.authorization?.replace("Bearer ", "");
  const loginService = new UserLoginService();

  // Attempt to authenticate with the token
  const loginResponse = await loginService.loginWithToken(token);
  if (loginResponse.success) {
    req.user = loginResponse.user;
    next();
    return;
  } else {
    res.status(loginResponse.errorCode ?? 500).json(loginResponse);
    return;
  }
}
