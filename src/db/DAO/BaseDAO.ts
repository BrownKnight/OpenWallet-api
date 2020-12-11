import { AnyOWEntity, DB } from "@db/db";
import { DeleteResult, ObjectLiteral, Repository } from "typeorm";

/**
 * Basic DAO implementation, for other DAO's specific to the entity to derive from.
 */
export class BaseDAO<TEntity extends AnyOWEntity & ObjectLiteral> {
  protected _repository: Repository<TEntity>;
  private _userId: number;
  protected _defaultRelations?: string[];

  constructor(entityClass: new () => TEntity, userId: number, defaultRelations?: string[]) {
    this._repository = DB.getRepository<TEntity>(entityClass);
    this._userId = userId;
    this._defaultRelations = defaultRelations;
  }

  protected whereCurrentUser(where?: ObjectLiteral): ObjectLiteral {
    return [
      { owningUserId: this._userId, ...where },
      { owningUserId: -1, ...where },
    ];
  }

  async getAll(): Promise<TEntity[]> {
    return await this._repository.find({ relations: this._defaultRelations, where: this.whereCurrentUser() });
  }

  async getByID(id: number): Promise<TEntity | undefined> {
    return await this._repository.findOne(id, {
      relations: this._defaultRelations,
      where: this.whereCurrentUser({ id: id }),
    });
  }

  async save(entity: Partial<TEntity>): Promise<TEntity> {
    // Create the entity from the request so that it calls BeforeInsert/BeforeUpdate correctly
    const dbEntity: TEntity = this._repository.create(entity);
    dbEntity.owningUserId = this._userId;
    return await this._repository.save(dbEntity);
  }

  async saveMultiple(entities: Partial<TEntity>[]): Promise<TEntity[]> {
    // Create the entity from the request so that it calls BeforeInsert/BeforeUpdate correctly
    const dbEntites = this._repository.create(entities).map((entity) => {
      return { ...entity, owningUserId: this._userId };
    });
    return await this._repository.save(dbEntites);
  }

  async delete(entityId: number): Promise<DeleteResult> {
    return await this._repository.delete(entityId);
  }
}
