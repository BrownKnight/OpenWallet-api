import { TransactionDAO } from "@db/DAO/TransactionDAO";
import { Transaction } from "@db/entity/Transaction";
import { BaseEntityService } from "@service/BaseEntityService";

export class TransactionService extends BaseEntityService<Transaction> {
  constructor() {
    super(TransactionDAO, ["currency"]);
  }
}
