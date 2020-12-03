import { AccountDAO } from "@db/DAO/AccountDAO";
import { Account } from "@db/entity/Account";
import { BaseEntityService } from "@service/BaseEntityService";

export class AccountService extends BaseEntityService<Account> {
  constructor() {
    super(AccountDAO);
  }
}
