import { OWEntity } from "@db/entity/OWEntity";
import { DeleteResult, FindManyOptions, FindOneOptions } from "typeorm";
import { TestData } from "../TestData";

export class MockBaseDAO<TEntity extends OWEntity> {
  protected testData: TEntity[];

  constructor(entityClass: new () => TEntity) {
    this.testData = new TestData().getData(entityClass);
  }

  async getAll(findOptions?: FindManyOptions<TEntity>): Promise<TEntity[]> {
    if (findOptions?.relations) {
      // TODO: Manage test data with various relations included/excluded
      return this.testData;
    }
    return this.testData;
  }

  async getByID(id: number): Promise<TEntity | undefined> {
    return this.testData.find((x) => x.id === id);
  }

  async find(findOptions?: FindOneOptions<TEntity>): Promise<TEntity | undefined> {
    if (findOptions?.relations) {
      // TODO: Manage test data with various relations included/excluded
      // TODO: Implement support for the FindOptions where condition
      return this.testData[0];
    }
    return this.testData[0];
  }

  async save(entity: Partial<TEntity>): Promise<TEntity> {
    const existingEntity = this.testData.find((x) => x.id === entity.id);
    if (existingEntity) {
      return existingEntity;
    } else {
      const newEntity: TEntity = { id: this.nextId(), dateModified: new Date() } as TEntity;
      this.testData.push(newEntity);
      return newEntity;
    }
  }

  async saveMultiple(entities: Partial<TEntity>[]): Promise<TEntity[]> {
    const savedEntites: TEntity[] = [];
    entities.forEach(async (x) => savedEntites.push(await this.save(x)));
    return savedEntites;
  }

  async delete(entityId: number): Promise<DeleteResult> {
    const entityToDelete = await this.getByID(entityId);
    // This is probably the slowest way to do this, so definitely fix in the future
    this.testData.filter((x) => x === entityToDelete);
    const deleteResult = new DeleteResult();
    deleteResult.affected = entityToDelete ? 1 : 0;
    return deleteResult;
  }

  nextId(): number {
    return (this.testData.reduce((max, current) => ((current.id ?? 0) > (max.id ?? 0) ? current : max)).id ?? 100) + 1;
  }
}
