import { AnyOWEntity } from "@db/db";
import { OWEntity } from "@db/entity/OWEntity";
import { AccountService } from "@service/AccountService";
import { BaseEntityService } from "@service/BaseEntityService";
import { CurrencyService } from "@service/CurrencyService";
import { InstitutionService } from "@service/InstitutionService";
import { TransactionService } from "@service/TransactionService";
import { UserService } from "@service/UserService";
import { MockBaseDAO } from "@test/db/mock/MockBaseDAO";
import { MockUserLoginDAO } from "@test/db/mock/MockUserLoginDAO";
import { TestData } from "@test/db/TestData";

jest.mock("@db/DAO/BaseDAO", () => {
  return {
    BaseDAO: jest.fn().mockImplementation((entityClass) => {
      return new MockBaseDAO(entityClass);
    }),
  };
});
jest.mock("@db/DAO/UserLoginDAO", () => {
  return {
    UserLoginDAO: jest.fn().mockImplementation(() => {
      return new MockUserLoginDAO();
    }),
  };
});

describe.each([
  [CurrencyService, TestData.instance.currencies, TestData.instance.generateCurrency.bind(TestData.instance)],
  [InstitutionService, TestData.instance.institutions, TestData.instance.generateInstitution.bind(TestData.instance)],
  [AccountService, TestData.instance.accounts, TestData.instance.generateAccount.bind(TestData.instance)],
  [TransactionService, TestData.instance.transactions, TestData.instance.generateTransaction.bind(TestData.instance)],
  [UserService, TestData.instance.users, TestData.instance.generateUser.bind(TestData.instance)],
])(
  `Basic CRUD Functions for %p`,
  (serviceClass: new () => BaseEntityService<OWEntity>, testData: OWEntity[], entityGenerator: () => AnyOWEntity) => {
    it("Can retrieve all entities", async () => {
      const service = new serviceClass();
      const response = await service.getAll();

      expect(response).not.toBeNull();
      expect(response.success).toBe(true);
      expect(response.entities?.length).toBeGreaterThan(0);
      expect(response.entities?.[0]).toEqual(testData[0]);
    });

    it(`Can retrieve an entity by it's ID`, async () => {
      const service = new serviceClass();
      const entity = testData[0];

      const response = await service.getById(entity.id ?? 0);

      expect(response).not.toBeNull();
      expect(response.success).toBe(true);
      expect(response.entities?.[0]).toEqual(entity);
    });

    it("Can save an entity, then retrieve it", async () => {
      const service = new serviceClass();
      const entity = entityGenerator();

      const saveResponse = await service.save(entity);
      const fetchResponse = await service.getById(entity.id ?? 0);

      expect(saveResponse).not.toBeNull();
      expect(saveResponse.success).toBe(true);
      expect(saveResponse.entities?.[0]).toEqual(entity);

      expect(fetchResponse).not.toBeNull();
      expect(fetchResponse.success).toBe(true);
      expect(fetchResponse.entities?.[0]).toEqual(entity);
    });

    it("Can delete a given entity using it's ID", async () => {
      const service = new serviceClass();
      const entity = testData[0];

      const deleteResponse = await service.deleteById(entity.id ?? 0);
      const fetchResponse = await service.getById(entity.id ?? 0);

      expect(deleteResponse).not.toBeNull();
      expect(deleteResponse.success).toBe(true);
      expect(deleteResponse.entities?.[0]).toEqual(entity);

      expect(fetchResponse).not.toBeNull();
      expect(fetchResponse.success).toBe(false);
      expect(fetchResponse.errorCode).toBe(404);
      expect(fetchResponse.errorMessage).not.toBeNull();
      expect(fetchResponse.entities?.length).toBe(0);
    });
  }
);
