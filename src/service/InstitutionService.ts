import { InstitutionDAO } from "@db/DAO/InstitutionDAO";
import { Institution } from "@db/entity/Institution";
import { BaseEntityService } from "@service/BaseEntityService";

export class InstitutionService extends BaseEntityService<Institution> {
  constructor() {
    super(InstitutionDAO);
  }
}
