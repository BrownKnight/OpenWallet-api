import { DB } from "@db/db";
import { DeleteResult, FindManyOptions, FindOneOptions, ObjectLiteral, Repository } from "typeorm";

/**
 * Basic DAO implementation, for other DAO's specific to the entity to derive from.
 */
export class BaseDAO<TEntity extends ObjectLiteral> {
  protected _repository: Repository<TEntity>;

  constructor(entityClass: new () => TEntity) {
    this._repository = DB.getRepository<TEntity>(entityClass);
  }

  async getAll(findOptions: FindManyOptions<TEntity> = {}): Promise<TEntity[]> {
    return this._repository.find(findOptions);
  }

  async getByID(id: number, findOptions: FindOneOptions<TEntity> = {}): Promise<TEntity | undefined> {
    return this._repository.findOne(id, findOptions);
  }

  async find(findOptions: FindOneOptions<TEntity>): Promise<TEntity | undefined> {
    return this._repository.findOne(findOptions);
  }

  async save(entity: Partial<TEntity>): Promise<TEntity> {
    // Create the entity from the request so that it calls BeforeInsert/BeforeUpdate correctly
    const dbEntity: TEntity = this._repository.create(entity);
    return this._repository.save(dbEntity);
  }

  async saveMultiple(entities: Partial<TEntity>[]): Promise<TEntity[]> {
    // Create the entity from the request so that it calls BeforeInsert/BeforeUpdate correctly
    const dbEntites = entities.map((entity) => this._repository.create(entity));
    return this._repository.save(dbEntites);
  }

  async delete(entityId: number): Promise<DeleteResult> {
    return this._repository.delete(entityId);
  }
}
