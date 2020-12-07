import { EntityRouter } from "@api/EntityRouter";
import { AdminOnly } from "@api/middleware/adminOnlyDecorator";
import { Currency } from "@db/entity/Currency";
import { CurrencyService } from "@service/CurrencyService";
import { Request, Response } from "express";

export class CurrenciesRouter extends EntityRouter<Currency, CurrencyService> {
  constructor() {
    super(CurrencyService);
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
    super.deleteById(req, res);
  }
}
