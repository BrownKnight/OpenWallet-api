import { DB, InMemoryPostgresDB } from "@db/db";
import { Account } from "@db/entity/Account";
import { Currency } from "@db/entity/Currency";
import { Institution } from "@db/entity/Institution";
import { OWEntity } from "@db/entity/OWEntity";
import { Transaction } from "@db/entity/Transaction";
import { AccountService } from "@service/AccountService";
import { BaseEntityService } from "@service/BaseEntityService";
import { CurrencyService } from "@service/CurrencyService";
import { InstitutionService } from "@service/InstitutionService";
import { TransactionService } from "@service/TransactionService";
import { As } from "../db/TestDataManager";

beforeAll(async () => {
  await DB.init();
  await (await As.StandingData()).initStandingData();

  // backup the db, so we don't have to init this standing data every time
  (DB as typeof InMemoryPostgresDB).backupDB();
});

beforeEach(async () => {
  (DB as typeof InMemoryPostgresDB).restoreDB();
});

afterAll(async () => {
  await DB.close();
});

describe.each([
  [Currency, CurrencyService],
  [Account, AccountService],
  [Transaction, TransactionService],
  [Institution, InstitutionService],
])(
  "CRUD Operations for %p",
  (entityClass: new () => OWEntity, entityService: new () => BaseEntityService<OWEntity>) => {
    it("is able to save and retrieve a new entity", async () => {
      const admin = await As.Admin();
      const service = new entityService();

      const newEntity = admin.generate(entityClass).getData(entityClass).pop() as OWEntity;

      const saveResponse = await service.save(newEntity);
      const fetchResponse = await service.getById(saveResponse.entities[0].id);

      expect(saveResponse).not.toBeNull();
      expect(saveResponse.success).toBe(true);
      expect(saveResponse.entities[0]).toMatchObject(newEntity);

      expect(fetchResponse).not.toBeNull();
      expect(fetchResponse.success).toBe(true);
      expect(fetchResponse.entities[0]).toMatchObject(newEntity);
    });

    it("is able to delete a newly created entity", async () => {
      const admin = await As.Admin();
      const service = new entityService();

      const newEntity = admin.generate(entityClass).getData(entityClass).pop() as OWEntity;

      const saveResponse = await service.save(newEntity);
      const deleteResponse = await service.deleteById(saveResponse.entities[0].id);

      expect(saveResponse).not.toBeNull();
      expect(saveResponse.success).toBe(true);
      expect(saveResponse.entities[0]).toMatchObject(newEntity);

      expect(deleteResponse).not.toBeNull();
      expect(deleteResponse.success).toBe(true);
      expect(deleteResponse.entities[0]).toMatchObject(newEntity);
    });

    it("is able to save multiple entities at once", async () => {
      const admin = await As.Admin();
      const service = new entityService();

      const newEntities = admin.generate(entityClass).getData(entityClass);

      const saveResponse = await service.saveMultiple(newEntities);
      const fetchResponse = await service.getById(saveResponse.entities[0].id);

      expect(saveResponse).not.toBeNull();
      expect(saveResponse.success).toBe(true);
      expect(saveResponse.entities).toMatchObject(newEntities);

      expect(fetchResponse).not.toBeNull();
      expect(fetchResponse.success).toBe(true);
      expect(fetchResponse.entities).toMatchObject(newEntities);
    });
  }
);
