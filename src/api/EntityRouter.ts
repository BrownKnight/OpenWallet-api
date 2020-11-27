import { BaseEntityService } from "@service/BaseEntityService";
import { Request, Response } from "express";
import { BaseRouter } from "./BaseRouter";

export abstract class EntityRouter<TEntity, TEntityService extends BaseEntityService<TEntity>> extends BaseRouter {
  protected entityService: TEntityService;

  constructor(entityService: new () => TEntityService) {
    super();
    this.entityService = new entityService();
    this.initEntityApiRoutes();
  }

  initEntityApiRoutes(): void {
    this.router.get("/", this.getAll.bind(this));
  }

  abstract initRoutes(): void;

  async getAll(req: Request, res: Response): Promise<void> {
    const serviceResponse = await this.entityService.getAll();
    if (serviceResponse.success) {
      res.status(200);
    } else {
      res.status(400);
    }
    res.json(serviceResponse);
  }
}
