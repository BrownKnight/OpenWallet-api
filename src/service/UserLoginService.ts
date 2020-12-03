import { UserLoginDAO } from "@db/DAO/UserLoginDAO";
import { UserLogin } from "@db/entity/UserLogin";
import { BaseEntityService } from "@service/BaseEntityService";
import { ServiceResponse } from "./ServiceResponse";

export class UserLoginService extends BaseEntityService<UserLogin> {
  constructor() {
    super(UserLoginDAO);
  }

  /** Fetches UserLogins with the user relation field loaded */
  async getAll(): Promise<ServiceResponse<UserLogin>> {
    const response = new ServiceResponse<UserLogin>();

    response.entities = await this.dao.getAll({ relations: ["user"] });

    return response;
  }

  /** Fetches UserLogin with the user relation field loaded */
  async getById(id: number): Promise<ServiceResponse<UserLogin>> {
    const response = await super.getById(id);
    response.entities.forEach((entity) => {
      entity.password = "";
    });

    return response;
  }
}
