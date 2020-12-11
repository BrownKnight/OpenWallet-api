import { Institution } from "@db/entity/Institution";
import { BaseDAO } from "./BaseDAO";

export class InstitutionDAO extends BaseDAO<Institution> {
  constructor(userId: number) {
    super(Institution, userId);
  }
}
