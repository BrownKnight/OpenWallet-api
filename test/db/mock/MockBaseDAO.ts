import { OWEntity } from "@db/entity/OWEntity";
import { DeleteResult, FindManyOptions, FindOneOptions, ObjectLiteral } from "typeorm";
import { TestData } from "../TestData";

export class MockBaseDAO<TEntity extends OWEntity> {
  private entityClass: new () => TEntity;

  protected testData: TEntity[];

  nextId(): number {
    return TestData.instance.nextId(this.entityClass);
  }

  constructor(entityClass: new () => TEntity) {
    this.entityClass = entityClass;
    this.testData = TestData.instance.getData(entityClass);
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

  async find(findOptions?: FindOneOptions<TEntity>): Promise<Partial<TEntity> | undefined> {
    let foundEntities = this.testData;

    // Filter by each of the keys in the findOptions where clause
    if (findOptions?.where) {
      Object.keys(findOptions.where).forEach((key) => {
        foundEntities = foundEntities.filter(
          (x) => x[key as keyof TEntity] === (findOptions.where as ObjectLiteral)[key]
        );
      });
    }

    if (findOptions?.select) {
      foundEntities = foundEntities.map((foundEntity) => {
        const newEntity: TEntity = {} as TEntity;
        findOptions.select?.forEach((selectedProperty) => {
          newEntity[selectedProperty] = foundEntity[selectedProperty];
        });

        return newEntity;
      });
    }
    if (findOptions?.relations) {
      // TODO: Manage test data with various relations included/excluded
      return foundEntities[0];
    }
    return foundEntities[0];
  }

  async save(entity: Partial<TEntity>): Promise<TEntity> {
    const existingEntityIndex = this.testData.findIndex((x) => x.id === entity.id);
    if (existingEntityIndex !== -1) {
      this.testData[existingEntityIndex] = {
        ...this.testData[existingEntityIndex],
        ...entity,
        dateModified: new Date(),
      } as TEntity;
      return this.testData[existingEntityIndex];
    } else {
      const newEntity: TEntity = { id: this.nextId(), dateModified: new Date(), ...entity } as TEntity;
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
    this.testData = this.testData.filter((x) => x.id != entityToDelete?.id);
    const deleteResult = new DeleteResult();
    deleteResult.affected = entityToDelete ? 1 : 0;
    return deleteResult;
  }

  getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName]; // o[propertyName] is of type T[K]
  }
}
