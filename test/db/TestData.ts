import { AnyOWEntity } from "@db/db";
import { Account } from "@db/entity/Account";
import { Currency } from "@db/entity/Currency";
import { Institution } from "@db/entity/Institution";
import { Transaction } from "@db/entity/Transaction";

export class TestData {
  private static _instance: TestData | undefined;
  static get instance(): TestData {
    return this._instance || (this._instance = new TestData());
  }

  currencies: Currency[];
  private constructor() {
    this.currencies = [{ id: 1, currencyCode: "GBP", currencySymbol: "£", dateModified: new Date() }];
  }

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

  nextId<TEntity extends AnyOWEntity>(entityClass: new () => TEntity): number {
    return (
      (this.getData(entityClass).reduce((max, current) => ((current.id ?? 0) > (max.id ?? 0) ? current : max)).id ??
        100) + 1
    );
  }
}
