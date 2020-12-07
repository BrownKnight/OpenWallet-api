import { EntityRouter } from "@api/EntityRouter";
import { User } from "@db/entity/User";
import { UserService } from "@service/UserService";

export class UsersRouter extends EntityRouter<User, UserService> {
  constructor() {
    super(UserService);
  }

  initRoutes(): void {
    // No extra routes
  }
}
