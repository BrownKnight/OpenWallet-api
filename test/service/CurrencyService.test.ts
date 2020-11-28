import { Currency } from "@db/entity/Currency";
import { CurrencyService } from "@service/CurrencyService";
import { MockBaseDAO } from "@test/db/mock/MockBaseDAO";
import { TestData } from "@test/db/TestData";

jest.mock("@db/DAO/CurrencyDAO", () => {
  return {
    CurrencyDAO: jest.fn().mockImplementation(() => {
      return new MockBaseDAO(Currency);
    }),
  };
});

describe("Basic CRUD Functions", () => {
  it("Can retrieve all entities", async () => {
    const service = new CurrencyService();
    const response = await service.getAll();

    expect(response).not.toBeNull();
    expect(response.success).toBe(true);
    expect(response.entities?.length).toBeGreaterThan(0);
    expect(response.entities?.[0]).toEqual(TestData.instance.currencies[0]);
  });

  it("Can retrieve an entity by it's ID", async () => {
    const service = new CurrencyService();
    const entity = TestData.instance.currencies[0];

    const response = await service.getById(entity.id ?? 0);

    expect(response).not.toBeNull();
    expect(response.success).toBe(true);
    expect(response.entities?.[0]).toEqual(entity);
  });

  it("Can save an entity, then retrieve it", async () => {
    const service = new CurrencyService();
    const entity: Currency = {
      id: TestData.instance.nextId(Currency),
      dateModified: new Date(),
      currencyCode: "TEST",
      currencySymbol: "T1",
    };

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
    const service = new CurrencyService();
    const entity = TestData.instance.currencies[0];

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
});
