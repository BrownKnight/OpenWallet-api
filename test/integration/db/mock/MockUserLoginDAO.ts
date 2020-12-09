import { UserLogin } from "@db/entity/UserLogin";
import { FindManyOptions } from "typeorm";
import { MockBaseDAO } from "./MockBaseDAO";

export class MockUserLoginDAO extends MockBaseDAO<UserLogin> {
  constructor() {
    super(UserLogin);
  }

  async getAll(findOptions?: FindManyOptions<UserLogin>): Promise<UserLogin[]> {
    if (findOptions?.relations) {
      // TODO: Manage test data with various relations included/excluded
    }

    const data = this.testData;
    return data.map((userLogin) => this.removeUnselectedColumns(userLogin) as UserLogin);
  }

  async getByID(id: number): Promise<UserLogin | undefined> {
    let userLogin = this.testData.find((x) => x.id === id);
    if (userLogin) {
      userLogin = this.removeUnselectedColumns(userLogin) as UserLogin;
    }
    return userLogin;
  }

  async getByUsername(username: string): Promise<Partial<UserLogin> | undefined> {
    return await this.find({
      select: ["id", "username", "password", "userRole"],
      where: { username: username },
    });
  }

  private removeUnselectedColumns(entity: UserLogin): Partial<UserLogin> {
    delete entity.password;
    delete entity.webToken;
    return entity;
  }
}
