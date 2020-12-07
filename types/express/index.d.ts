import { TokenPayload } from "@service/UserLoginService";

declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayload;
  }
}
