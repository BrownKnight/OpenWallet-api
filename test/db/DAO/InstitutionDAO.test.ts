import { InstitutionDAO } from "../../../src/db/DAO/InstitutionDAO";
import { DBConnection } from "../../../src/db/db";
import { Institution } from "../../../src/db/entity/Institution";
import { TestData } from "../TestData";

//#region Jest hooks for test suites that use the DB
beforeAll(async () => {
  await DBConnection.init();
});

afterAll(async () => {
  await DBConnection.close();
});

// Empty all the db tables so each test has clean data to work with
beforeEach(async () => {
  await DBConnection.clear();
});
//#endregion Jest Hooks

describe("CRUD DAO Operations", () => {
  it("Can save and fetch (by id) entities to the database", async () => {
    const dao = new InstitutionDAO();
    const entity: Institution = new TestData().institutions[0];

    const savedEntity = await dao.save(entity);
    expect(savedEntity).not.toBeNull();
    expect(savedEntity.id).not.toBeNull();

    if (savedEntity.id) {
      const fetchedEntity = await dao.getByID(savedEntity.id);
      expect(fetchedEntity).not.toBeNull();
      expect(fetchedEntity).toEqual(savedEntity);
    }
  });

  it("Can find entities by its properties", async () => {
    const dao = new InstitutionDAO();
    const entities: Institution[] = new TestData().institutions;

    dao.saveMultiple(entities);
    const entity = await dao.getByID(entities[0].id ?? 1);

    const fetchedEntity = await dao.find({ where: { credentialsType: entities[0].credentialsType } });
    expect(fetchedEntity).not.toBeNull();
    expect(fetchedEntity).toEqual(entity);
  });
});
