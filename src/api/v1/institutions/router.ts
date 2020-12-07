import { EntityRouter } from "@api/EntityRouter";
import { Institution } from "@db/entity/Institution";
import { InstitutionService } from "@service/InstitutionService";

export class InstitutionsRouter extends EntityRouter<Institution, InstitutionService> {
  constructor() {
    super(InstitutionService);
  }

  initRoutes(): void {
    // No extra routes
  }
}
