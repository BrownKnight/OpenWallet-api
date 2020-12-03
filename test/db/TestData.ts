import { AnyOWEntity } from "@db/db";
import { Account } from "@db/entity/Account";
import { Currency } from "@db/entity/Currency";
import { Institution } from "@db/entity/Institution";
import { OWEntity } from "@db/entity/OWEntity";
import { Transaction } from "@db/entity/Transaction";

export class TestData {
  private static _instance: TestData | undefined;
  static get instance(): TestData {
    return this._instance || (this._instance = new TestData());
  }

  currencies: Currency[];
  private constructor() {
    this.currencies = [this.generateCurrency(), this.generateCurrency()];
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
      (this.getData(entityClass)?.reduce((max, current) => ((current.id ?? 0) > (max.id ?? 0) ? current : max))?.id ??
        100) + 1
    );
  }

  generateCurrency(): Currency {
    const newOWEntity = this.generateOWEntity(Currency);
    const id = newOWEntity.id;
    return { ...newOWEntity, currencyCode: `TEST${id}`, currencySymbol: `T${id}` };
  }

  generateOWEntity(entityClass: new () => OWEntity): OWEntity {
    return { id: this.nextId(entityClass), dateModified: new Date() };
  }
}
