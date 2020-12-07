import { OWEntity } from "@db/entity/OWEntity";
import { BaseEntityService } from "@service/BaseEntityService";
import { ServiceResponse } from "@service/responses/ServiceResponse";
import { Request, Response } from "express";
import { BaseRouter } from "./BaseRouter";

export abstract class EntityRouter<
  TEntity extends OWEntity,
  TEntityService extends BaseEntityService<TEntity>
> extends BaseRouter {
  protected entityService: TEntityService;

  constructor(entityService: new () => TEntityService) {
    super();
    this.entityService = new entityService();
    this.initEntityApiRoutes();
  }

  initEntityApiRoutes(): void {
    this.router.get("/", this.getAll.bind(this));
    this.router.get("/:entityId", this.getById.bind(this));
    this.router.put("/", this.save.bind(this));
    this.router.delete("/:entityId", this.deleteById.bind(this));
  }

  abstract initRoutes(): void;

  async getAll(req: Request, res: Response): Promise<void> {
    const serviceResponse = await this.entityService.getAll();
    res.status(serviceResponse.errorCode ?? 200).json(serviceResponse);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const entityIdString = req.params["entityId"];
    const entityId = parseInt(entityIdString, 10);

    if (isNaN(entityId)) {
      res.status(400).json(new ServiceResponse(false, undefined, undefined, 400, "Entity ID parameter invalid"));
      return;
    }

    const serviceResponse = await this.entityService.getById(entityId);
    res.status(serviceResponse.errorCode ?? 200).json(serviceResponse);
  }

  async save(req: Request, res: Response): Promise<void> {
    const body = req.body;
    if (body == null || body == "") {
      res.status(400).json(new ServiceResponse(false, undefined, undefined, 400, "Invalid entity in body"));
      return;
    }

    let serviceResponse = new ServiceResponse();
    if (Array.isArray(body)) {
      serviceResponse = await this.entityService.saveMultiple(body);
    } else {
      serviceResponse = await this.entityService.save(body);
    }

    res.status(serviceResponse.errorCode ?? 201).json(serviceResponse);
  }

  async deleteById(req: Request, res: Response): Promise<void> {
    const entityIdString = req.params["entityId"];
    const entityId = parseInt(entityIdString, 10);

    if (isNaN(entityId)) {
      res.status(400).json(new ServiceResponse(false, undefined, undefined, 400, "Entity ID parameter invalid"));
      return;
    }

    const serviceResponse = await this.entityService.deleteById(entityId);
    res.status(serviceResponse.errorCode ?? 200).json(serviceResponse);
  }
}
