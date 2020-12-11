import { UserLogin } from "@db/entity/UserLogin";
import { BaseDAO } from "@db/DAO/BaseDAO";

export class UserLoginDAO extends BaseDAO<UserLogin> {
  constructor() {
    super(UserLogin, -1, ["user"]);
  }

  async getByUsername(username: string): Promise<Partial<UserLogin> | undefined> {
    return await this._repository.findOne({
      select: ["id", "username", "password", "userRole"],
      where: { username: username },
    });
  }
}
