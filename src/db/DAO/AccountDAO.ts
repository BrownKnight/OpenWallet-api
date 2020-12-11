import { Account } from "@db/entity/Account";
import { BaseDAO } from "./BaseDAO";

export class AccountDAO extends BaseDAO<Account> {
  constructor(userId: number) {
    super(Account, userId, ["institution"]);
  }
}
