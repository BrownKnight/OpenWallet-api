import { Institution } from "@db/entity/Institution";
import { BaseDAO } from "./BaseDAO";

export class InstitutionDAO extends BaseDAO<Institution> {
  constructor() {
    super(Institution);
  }
}
