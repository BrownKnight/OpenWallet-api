import { AnyOWEntity } from "@db/db";
import { Account } from "@db/entity/Account";
import { Currency } from "@db/entity/Currency";
import { CredentialsType } from "@db/entity/enum/CredentialsType";
import { DataSource } from "@db/entity/enum/DataSource";
import { UserRole } from "@db/entity/enum/UserRole";
import { Institution } from "@db/entity/Institution";
import { OWEntity } from "@db/entity/OWEntity";
import { Transaction } from "@db/entity/Transaction";
import { User } from "@db/entity/User";
import { UserLogin } from "@db/entity/UserLogin";

export class TestData {
  private static _instance: TestData | undefined;
  static get instance(): TestData {
    return this._instance || (this._instance = new TestData());
  }

  currencies: Currency[] = [];
  institutions: Institution[] = [];
  transactions: Transaction[] = [];
  accounts: Account[] = [];
  users: User[] = [];
  userLogins: UserLogin[] = [];
  private constructor() {
    this.generateData(this.generateCurrency.bind(this), this.currencies, 2);
    this.generateData(this.generateInstitution.bind(this), this.institutions, 2);
    this.generateData(this.generateTransaction.bind(this), this.transactions, 2);
    this.generateData(this.generateAccount.bind(this), this.accounts, 2);
    this.generateData(this.generateUserLogin.bind(this), this.userLogins, 2);
    this.generateData(this.generateUser.bind(this), this.users, 2);
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
      case UserLogin:
        return this.userLogins as TEntity[];
      case User:
        return this.users as TEntity[];
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
    return { id: this.nextId(entityClass), dateModified: new Date() };
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

  generateUser(): User {
    const newOWEntity = this.generateOWEntity(User);
    const id = newOWEntity.id;
    const existingUserLogin = this.userLogins.find((x) => x.id === id);
    if (existingUserLogin) {
      return existingUserLogin.user as User;
    } else {
      return this.generateUserLogin().user as User;
    }
  }

  /** For desired functionality, should always be run before generateUser */
  generateUserLogin(): UserLogin {
    let newUserLogin = new UserLogin();
    const newOWEntity = this.generateOWEntity(UserLogin);
    const id = newOWEntity.id;
    newUserLogin = {
      ...newUserLogin,
      ...newOWEntity,
      username: `TESTUSER${id}@OpenWallet.email`,
      password: "TESTPASSWORD",
      // All odd id's are ADMIN's
      userRole: id % 2 === 0 ? UserRole.STANDARD : UserRole.ADMIN,
      user: {
        ...newOWEntity,
        emailAddress: `TESTUSER${id}@OpenWallet.email`,
        firstName: `FIRSTNAME${id}`,
        lastName: `LASTNAME${id}`,
      },
      encryptPassword: newUserLogin.encryptPassword,
    };
    newUserLogin.encryptPassword?.();
    return newUserLogin;
  }
}
