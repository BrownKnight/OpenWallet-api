import { AnyOWEntity } from "@db/db";
import { Account } from "@db/entity/Account";
import { Currency } from "@db/entity/Currency";
import { CredentialsType } from "@db/entity/enum/CredentialsType";
import { DataSource } from "@db/entity/enum/DataSource";
import { Institution } from "@db/entity/Institution";
import { OWEntity } from "@db/entity/OWEntity";
import { Transaction } from "@db/entity/Transaction";

export class TestData {
  private static _instance: TestData | undefined;
  static get instance(): TestData {
    return this._instance || (this._instance = new TestData());
  }

  currencies: Currency[];
  institutions: Institution[];
  transactions: Transaction[];
  accounts: Account[];
  private constructor() {
    this.currencies = [this.generateCurrency(), this.generateCurrency()];
    this.institutions = [this.generateInstitution(), this.generateInstitution()];
    this.transactions = [this.generateTransaction(), this.generateTransaction()];
    this.accounts = [this.generateAccount(), this.generateAccount()];
  }

  getData<TEntity extends AnyOWEntity>(entityClass: new () => TEntity): TEntity[] {
    switch (entityClass) {
      case Currency:
        return this.currencies as TEntity[];
      case Institution:
        return this.institutions as TEntity[];
      case Account:
        return this.accounts as TEntity[];
      case Transaction:
        return this.transactions as TEntity[];
    }
    console.error(`Couldn't find test data for ${entityClass}!`);
    return [];
  }

  nextId<TEntity extends AnyOWEntity>(entityClass: new () => TEntity): number {
    return (
      (this.getData(entityClass)?.reduce((max, current) => ((current.id ?? 0) > (max.id ?? 0) ? current : max))?.id ??
        100) + 1
    );
  }

  generateOWEntity(entityClass: new () => OWEntity): OWEntity {
    return { id: this.nextId(entityClass), dateModified: new Date() };
  }

  generateCurrency(): Currency {
    const newOWEntity = this.generateOWEntity(Currency);
    const id = newOWEntity.id;
    return { ...newOWEntity, currencyCode: `TEST${id}`, currencySymbol: `T${id}` };
  }

  generateInstitution(): Institution {
    const newOWEntity = this.generateOWEntity(Currency);
    const id = newOWEntity.id;
    return {
      ...newOWEntity,
      credentialsType: CredentialsType.OAUTH2,
      dataSource: DataSource.LOCAL,
      fullName: `TESTACCOUNT${id}`,
    };
  }

  generateTransaction(): Transaction {
    const newOWEntity = this.generateOWEntity(Currency);
    const id = newOWEntity.id;
    return {
      ...newOWEntity,
      currency: this.currencies[0],
      monetaryAmount: 10 * id,
    };
  }

  generateAccount(): Account {
    const newOWEntity = this.generateOWEntity(Currency);
    const id = newOWEntity.id;
    return {
      ...newOWEntity,
      institution: this.institutions[0],
      name: `TESTACCOUNT${id}`,
    };
  }
}
