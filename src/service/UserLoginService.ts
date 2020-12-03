import { UserLoginDAO } from "@db/DAO/UserLoginDAO";
import { UserLogin } from "@db/entity/UserLogin";
import { BaseEntityService } from "@service/BaseEntityService";

export class UserLoginService extends BaseEntityService<UserLogin> {
  constructor() {
    super(UserLoginDAO);
  }
}
