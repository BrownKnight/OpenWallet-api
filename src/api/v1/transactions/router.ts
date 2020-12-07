import { EntityRouter } from "@api/EntityRouter";
import { Transaction } from "@db/entity/Transaction";
import { TransactionService } from "@service/TransactionService";

export class TransactionsRouter extends EntityRouter<Transaction, TransactionService> {
  constructor() {
    super(TransactionService);
  }

  initRoutes(): void {
    // No extra routes
  }
}
