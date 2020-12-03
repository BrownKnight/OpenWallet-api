import { TokenPayload } from "@service/UserLoginService";

export class LoginResponse {
  success: boolean;
  errorCode?: number;
  errorMessage?: string;
  token?: string;
  user?: TokenPayload;

  constructor(success?: boolean, errorCode?: number, errorMessage?: string, token?: string, user?: TokenPayload) {
    this.success = success ?? true;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.token = token;
    this.user = user;
  }
}
