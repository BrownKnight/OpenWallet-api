import { BaseDAO } from "@db/DAO/BaseDAO";
import { OWEntity } from "@db/entity/OWEntity";
import { BaseEntityService } from "@service/BaseEntityService";
import { ServiceResponse } from "@service/ServiceResponse";

export abstract class MockBaseEntityService<TEntity extends OWEntity> extends BaseEntityService<TEntity> {
  constructor(entityDAO: new () => BaseDAO<TEntity>) {
    super(entityDAO);
  }

  async getAll(): Promise<ServiceResponse<TEntity>> {
    const response = new ServiceResponse<TEntity>();

    response.entities = await this.dao.getAll();

    return response;
  }

  async getById(id: number): Promise<ServiceResponse<TEntity>> {
    const response = new ServiceResponse<TEntity>();

    const entity = await this.dao.getByID(id);
    if (entity) {
      response.entities = [entity];
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

    const entity = await this.dao.getByID(id);
    if (entity) {
      response.entities = [entity];
    }

    const deleteResult = await this.dao.delete(id);
    response.message = `Deleted ${deleteResult.affected} records`;

    return response;
  }
}
