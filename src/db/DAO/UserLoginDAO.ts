import { UserLogin } from "@db/entity/UserLogin";
import { BaseDAO } from "./BaseDAO";

export class UserLoginDAO extends BaseDAO<UserLogin> {
  constructor() {
    super(UserLogin);
  }
}
