import { UserRole } from "@db/entity/enum/UserRole";
import { User } from "@db/entity/User";
import { UserLogin } from "@db/entity/UserLogin";
import { AccountService } from "@service/AccountService";
import { CurrencyService } from "@service/CurrencyService";
import { InstitutionService } from "@service/InstitutionService";
import { TransactionService } from "@service/TransactionService";
import { UserLoginService } from "@service/UserLoginService";
import { UserService } from "@service/UserService";
import { DeepPartial } from "typeorm";

export class As {
  private userId!: number;

  private accountService = new AccountService();
  private currencyService = new CurrencyService();
  private institutionService = new InstitutionService();
  private transactionService = new TransactionService();
  private userLoginService = new UserLoginService();

  private static adminInstance: As;

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

  private async init(userLogin: UserLogin): Promise<this> {
    // const userService = new UserService();

    // const user: User = {
    //   id: 1,
    //   emailAddress: `${userLogin.username}@OW.email`,
    //   firstName: `${userLogin.username}.fname`,
    //   lastName: `${userLogin.username}.lname`,
    //   owningUserId: 1,
    // } as User;
    // const savedUser = await (await userService.save(user)).entities[0];

    // userLogin.user = { id: savedUser.id } as User;

    const userLoginService = new UserLoginService();
    const saved = await userLoginService.save(userLogin);

    this.userId = saved.entities?.[0].id ?? -1;

    return this;
  }

  async initData(): Promise<this> {
    // const testData = MockTestData.instance;
    // init the "standing" data
    // await this.currencyService.saveMultiple(testData.currencies);
    // await this.institutionService.saveMultiple(testData.institutions);

    // // TODO: refactor this into indiviudal generator/save functions
    // await this.accountService.saveMultiple(testData.accounts);
    // await this.transactionService.saveMultiple(testData.transactions);

    return this;
  }
}
