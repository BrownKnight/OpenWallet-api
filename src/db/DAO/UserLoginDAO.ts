import { UserLogin } from "@db/entity/UserLogin";
import { BaseDAO } from "./BaseDAO";

export class UserLoginDAO extends BaseDAO<UserLogin> {
  constructor() {
    super(UserLogin);
  }

  async getByUsername(username: string): Promise<Partial<UserLogin> | undefined> {
    return await this._repository.findOne({
      select: ["id", "username", "password"],
      where: { username: username },
    });
  }
}
