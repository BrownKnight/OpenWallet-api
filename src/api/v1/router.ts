import { BaseRouter } from "@api/BaseRouter";
import { LoginRouter } from "@api/v1/login/router";
import { AccountsRouter } from "./accounts/router";
import { CurrenciesRouter } from "./currencies/router";
import { InstitutionsRouter } from "./institutions/router";
import { TransactionsRouter } from "./transactions/router";

export class ApiV1Router extends BaseRouter {
  protected initRoutes(): void {
    this.router.use("/login", new LoginRouter().router);
    this.router.use("/currencies", new CurrenciesRouter().router);
    this.router.use("/transactions", new TransactionsRouter().router);
    this.router.use("/accounts", new AccountsRouter().router);
    this.router.use("/institutions", new InstitutionsRouter().router);
  }
}
