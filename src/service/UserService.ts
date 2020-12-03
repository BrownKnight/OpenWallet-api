import { UserDAO } from "@db/DAO/UserDAO";
import { User } from "@db/entity/User";
import { BaseEntityService } from "@service/BaseEntityService";

export class UserService extends BaseEntityService<User> {
  constructor() {
    super(UserDAO);
  }
}
