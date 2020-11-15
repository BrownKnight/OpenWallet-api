import pkg, { ObjectLiteral } from "typeorm";
const { getRepository } = pkg;

/**
 * Basic DAO implementation, for other DAO's specific to the entity to derive from.
 */
export class BaseDAO<TEntity extends ObjectLiteral> {
  protected _repository: pkg.Repository<TEntity>;

  constructor(entityClass: new () => TEntity) {
    this._repository = getRepository<TEntity>(entityClass);
  }

  async getAll(findOptions: pkg.FindManyOptions<TEntity> = {}): Promise<TEntity[]> {
    return this._repository.find(findOptions);
  }

  async getByID(id: number, findOptions: pkg.FindOneOptions<TEntity> = {}): Promise<TEntity | undefined> {
    return this._repository.findOne(id, findOptions);
  }

  async find(findOptions: pkg.FindOneOptions<TEntity>): Promise<TEntity | undefined> {
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

  async delete(entityId: number): Promise<pkg.DeleteResult> {
    return this._repository.delete(entityId);
  }
}
