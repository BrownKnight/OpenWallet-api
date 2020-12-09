import { AnyOWEntity } from "@db/db";
import { Account } from "@db/entity/Account";
import { Currency } from "@db/entity/Currency";
import { CredentialsType } from "@db/entity/enum/CredentialsType";
import { DataSource } from "@db/entity/enum/DataSource";
import { Institution } from "@db/entity/Institution";
import { OWEntity } from "@db/entity/OWEntity";
import { Transaction } from "@db/entity/Transaction";
import { User } from "@db/entity/User";
import { UserLogin } from "@db/entity/UserLogin";

export class MockTestData {
  private static _instance: MockTestData | undefined;
  static get instance(): MockTestData {
    return this._instance || (this._instance = new MockTestData());
  }

  currencies: Currency[] = [];
  institutions: Institution[] = [];
  transactions: Transaction[] = [];
  accounts: Account[] = [];
  users: User[] = [];
  userLogins: UserLogin[] = [];
  private constructor() {
    this.generateData(this.generateCurrency.bind(this), this.currencies, 2);
    this.generateData(this.generateInstitution.bind(this), this.institutions, 1);
    this.generateData(this.generateTransaction.bind(this), this.transactions, 1);
    this.generateData(this.generateAccount.bind(this), this.accounts, 1);
  }

  private generateData<TEntity>(generator: () => TEntity, array: TEntity[], num: number) {
    for (let i = 0; i < num; i++) {
      array.push(generator());
    }
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
    const data = this.getData(entityClass);
    if (data.length > 0) {
      return data.reduce((max, current) => (current.id > max ? current.id : max), 0) + 1;
    }
    return 101;
  }

  generateOWEntity(entityClass: new () => AnyOWEntity): OWEntity {
    return { id: this.nextId(entityClass), dateModified: new Date(), owningUserId: 101 };
  }

  generateCurrency(): Currency {
    const newOWEntity = this.generateOWEntity(Currency);
    const id = newOWEntity.id;
    return { ...newOWEntity, currencyCode: `TEST${id}`, currencySymbol: `T${id}` };
  }

  generateInstitution(): Institution {
    const newOWEntity = this.generateOWEntity(Institution);
    const id = newOWEntity.id;
    return {
      ...newOWEntity,
      credentialsType: CredentialsType.OAUTH2,
      dataSource: DataSource.LOCAL,
      fullName: `TESTACCOUNT${id}`,
    };
  }

  generateTransaction(): Transaction {
    const newOWEntity = this.generateOWEntity(Transaction);
    const id = newOWEntity.id;
    return {
      ...newOWEntity,
      currency: this.currencies[0],
      monetaryAmount: 10 * id,
    };
  }

  generateAccount(): Account {
    const newOWEntity = this.generateOWEntity(Account);
    const id = newOWEntity.id;
    return {
      ...newOWEntity,
      institution: this.institutions[0],
      name: `TESTACCOUNT${id}`,
    };
  }
}
