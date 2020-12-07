import { EntityRouter } from "@api/EntityRouter";
import { AdminOnly } from "@api/middleware/adminOnlyDecorator";
import { Institution } from "@db/entity/Institution";
import { InstitutionService } from "@service/InstitutionService";
import { Request, Response } from "express";

export class InstitutionsRouter extends EntityRouter<Institution, InstitutionService> {
  constructor() {
    super(InstitutionService);
  }

  initRoutes(): void {
    // No extra routes
  }

  @AdminOnly()
  protected async save(req: Request, res: Response): Promise<void> {
    super.save(req, res);
  }

  @AdminOnly()
  protected async deleteById(req: Request, res: Response): Promise<void> {
    super.save(req, res);
  }
}
