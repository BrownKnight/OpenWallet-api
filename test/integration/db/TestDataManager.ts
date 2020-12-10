import { AnyOWEntity } from "@db/db";
import { Account } from "@db/entity/Account";
import { Currency } from "@db/entity/Currency";
import { UserRole } from "@db/entity/enum/UserRole";
import { Institution } from "@db/entity/Institution";
import { User } from "@db/entity/User";
import { Transaction } from "@db/entity/Transaction";
import { UserLogin } from "@db/entity/UserLogin";
import { AccountService } from "@service/AccountService";
import { CurrencyService } from "@service/CurrencyService";
import { InstitutionService } from "@service/InstitutionService";
import { TransactionService } from "@service/TransactionService";
import { UserLoginService } from "@service/UserLoginService";
import { UserService } from "@service/UserService";
import { CredentialsType } from "@db/entity/enum/CredentialsType";
import { DataSource } from "@db/entity/enum/DataSource";

export class As {
  private userId!: number;

  private accountService = new AccountService();
  private currencyService = new CurrencyService();
  private institutionService = new InstitutionService();
  private transactionService = new TransactionService();
  private userLoginService = new UserLoginService();

  private static adminInstance: As;
  private static standingDataInstance: As;
  private currencies: Partial<Currency>[] = [];
  private institutions: Partial<Institution>[] = [];
  private accounts: Partial<Account>[] = [];
  private transactions: Partial<Transaction>[] = [];
  private userLogins: Partial<UserLogin>[] = [];
  private users: Partial<User>[] = [];

  static async Admin(): Promise<As> {
    const adminUserLogin: UserLogin = {
      id: 1,
      owningUserId: 1,
      userRole: UserRole.ADMIN,
      username: "Admin",
      password: "TESTPASSWORD",
    };
    this.adminInstance = await new As().init(adminUserLogin);
    return this.adminInstance;
  }

  static async StandingData(): Promise<As> {
    this.standingDataInstance = new As();
    this.standingDataInstance.userId = -1;
    await this.standingDataInstance.initStandingData();
    return this.standingDataInstance;
  }

  private async init(userLogin: UserLogin): Promise<this> {
    const userService = new UserService();

    const user: User = {
      id: 1,
      emailAddress: `${userLogin.username}@OW.email`,
      firstName: `${userLogin.username}.fname`,
      lastName: `${userLogin.username}.lname`,
      owningUserId: 1,
    } as User;
    const savedUser = (await userService.save(user)).entities[0];

    userLogin.user = { id: savedUser.id } as User;
    this.users.push(savedUser);

    const userLoginService = new UserLoginService();
    const saved = await userLoginService.save(userLogin);

    this.userId = saved.entities?.[0].id ?? -1;
    this.userLogins.push(saved.entities[0]);

    return this;
  }

  async initStandingData(): Promise<this> {
    this.generateCurrency();
    this.generateCurrency();
    this.generateInstitution();
    this.generateInstitution();

    await this.currencyService.saveMultiple(this.currencies);
    await this.institutionService.saveMultiple(this.institutions);

    return this;
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

  generateCurrency(): this {
    this.currencies.push({
      currencyCode: `TEST${this.userId}-${this.currencies.length}`,
      currencySymbol: `T${this.userId}-${this.currencies.length}`,
    });
    return this;
  }

  generateInstitution(): this {
    this.institutions.push({
      credentialsType: CredentialsType.OAUTH2,
      dataSource: DataSource.LOCAL,
      fullName: `TESTINSTITUTION${this.userId}-${this.institutions.length}`,
      owningUserId: this.userId,
    });
    return this;
  }

  generateTransaction(): this {
    this.transactions.push({
      currency: { id: this.currencies[0].id } as Currency,
      monetaryAmount: 10,
    });
    return this;
  }

  generateAccount(): this {
    this.accounts.push({
      institution: { id: this.institutions[0].id } as Institution,
      name: `TESTACCOUNT${this.userId}-${this.accounts.length}`,
    });
    return this;
  }
}
