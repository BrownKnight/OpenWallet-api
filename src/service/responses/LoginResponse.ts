export class LoginResponse {
  success: boolean;
  errorCode?: number;
  errorMessage?: string;
  token?: string;

  constructor(success?: boolean, errorCode?: number, errorMessage?: string, token?: string) {
    this.success = success ?? true;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.token = token;
  }
}
