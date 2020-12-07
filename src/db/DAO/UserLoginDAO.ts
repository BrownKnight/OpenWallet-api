import { UserLogin } from "@db/entity/UserLogin";
import { BaseDAO } from "@db/DAO/BaseDAO";

export class UserLoginDAO extends BaseDAO<UserLogin> {
  constructor() {
    super(UserLogin);
  }

  async getByUsername(username: string): Promise<Partial<UserLogin> | undefined> {
    return await this.find({
      select: ["id", "username", "password", "userRole"],
      where: { username: username },
    });
  }
}
