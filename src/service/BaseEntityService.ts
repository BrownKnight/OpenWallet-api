import { BaseDAO } from "@db/DAO/BaseDAO";
import { OWEntity } from "@db/entity/OWEntity";
import { ServiceResponse } from "@service/responses/ServiceResponse";

export abstract class BaseEntityService<TEntity extends OWEntity> {
  protected dao: BaseDAO<TEntity>;
  protected defaultRelations: string[];

  constructor(entityDAO: new () => BaseDAO<TEntity>, defaultRelations: string[] = []) {
    this.dao = new entityDAO();
    this.defaultRelations = defaultRelations;
  }

  async getAll(): Promise<ServiceResponse<TEntity>> {
    const response = new ServiceResponse<TEntity>();

    response.entities = await this.dao.getAll({ relations: this.defaultRelations });

    return response;
  }

  async getById(id: number): Promise<ServiceResponse<TEntity>> {
    let response = new ServiceResponse<TEntity>();

    const entity = await this.dao.getByID(id, { relations: this.defaultRelations });
    if (entity) {
      response.entities = [entity];
    } else {
      response = { ...response, success: false, errorCode: 404, errorMessage: `Could not find entity with ID ${id}` };
    }

    return response;
  }

  async save(entity: Partial<TEntity>): Promise<ServiceResponse<TEntity>> {
    const response = new ServiceResponse<TEntity>();

    response.entities = [await this.dao.save(entity)];

    return response;
  }

  async saveMultiple(entities: Array<Partial<TEntity>>): Promise<ServiceResponse<TEntity>> {
    const response = new ServiceResponse<TEntity>();

    response.entities = await this.dao.saveMultiple(entities);

    return response;
  }

  async deleteById(id: number): Promise<ServiceResponse<TEntity>> {
    const response = new ServiceResponse<TEntity>();

    const entity = (await this.getById(id)).entities[0];
    if (entity) {
      response.entities = [entity];
    }

    const deleteResult = await this.dao.delete(id);
    response.message = `Deleted ${deleteResult.affected} records`;

    return response;
  }
}
