import { User } from "@db/entity/User";
import { BaseDAO } from "./BaseDAO";

export class UserDAO extends BaseDAO<User> {
  constructor() {
    super(User);
  }
}
