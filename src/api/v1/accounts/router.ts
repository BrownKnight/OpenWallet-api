import { EntityRouter } from "@api/EntityRouter";
import { Account } from "@db/entity/Account";
import { AccountService } from "@service/AccountService";

export class AccountsRouter extends EntityRouter<Account, AccountService> {
  constructor() {
    super(AccountService);
  }

  initRoutes(): void {
    // No extra routes
  }
}
