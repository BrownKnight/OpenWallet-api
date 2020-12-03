import { UserLoginDAO } from "@db/DAO/UserLoginDAO";
import { UserLogin } from "@db/entity/UserLogin";
import { BaseEntityService } from "@service/BaseEntityService";
import { ServiceResponse } from "./ServiceResponse";

export class UserLoginService extends BaseEntityService<UserLogin> {
  constructor() {
    super(UserLoginDAO);
  }

  // Override getAll here to remove the password field
  async getAll(): Promise<ServiceResponse<UserLogin>> {
    const response = await super.getAll();
    response.entities.forEach((entity) => {
      entity.password = "";
    });

    return response;
  }

  // Override getById here to remove the password field
  async getById(id: number): Promise<ServiceResponse<UserLogin>> {
    const response = await super.getById(id);
    response.entities.forEach((entity) => {
      entity.password = "";
    });

    return response;
  }
}
