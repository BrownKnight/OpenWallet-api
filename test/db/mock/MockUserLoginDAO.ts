import { UserLogin } from "@db/entity/UserLogin";
import { MockBaseDAO } from "./MockBaseDAO";

export class MockUserLoginDAO extends MockBaseDAO<UserLogin> {
  constructor() {
    super(UserLogin);
  }

  async getByUsername(username: string): Promise<Partial<UserLogin> | undefined> {
    return await this.find({
      select: ["id", "username", "password"],
      where: { username: username },
    });
  }
}
