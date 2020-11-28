import { AnyOWEntity } from "@db/db";
import { Account } from "@db/entity/Account";
import { Currency } from "@db/entity/Currency";
import { Institution } from "@db/entity/Institution";
import { Transaction } from "@db/entity/Transaction";

export class TestData {
  currencies: Currency[] = [{ id: 1, currencyCode: "GBP", currencySymbol: "£", dateModified: new Date() }];

  getData<TEntity extends AnyOWEntity>(entityClass: new () => TEntity): TEntity[] {
    switch (entityClass) {
      case Currency:
        return this.currencies as TEntity[];
      case Institution:
        return [];
      case Account:
        return [];
      case Transaction:
        return [];
    }

    return [];
  }
}
