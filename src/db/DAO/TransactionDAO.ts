import { Transaction } from "@db/entity/Transaction";
import { BaseDAO } from "./BaseDAO";

export class TransactionDAO extends BaseDAO<Transaction> {
  constructor() {
    super(Transaction);
  }
}
