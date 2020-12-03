import { Account } from "@db/entity/Account";
import { BaseDAO } from "./BaseDAO";

export class AccountDAO extends BaseDAO<Account> {
  constructor() {
    super(Account);
  }
}
