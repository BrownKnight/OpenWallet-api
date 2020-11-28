import { Currency } from "@db/entity/Currency";
import { CurrencyService } from "@service/CurrencyService";
import { MockBaseDAO } from "@test/db/mock/MockBaseDAO";

jest.mock("@db/DAO/CurrencyDAO", () => {
  return {
    CurrencyDAO: jest.fn().mockImplementation(() => {
      return new MockBaseDAO(Currency);
    }),
  };
});

describe("Able to save and then retrieve an entity", () => {
  it("Can save and retrieve an entity", async () => {
    const service = new CurrencyService();
    const allCurrencies = await service.getAll();

    expect(allCurrencies).not.toBeNull();
    expect(allCurrencies.entities?.length).toBeGreaterThan(0);
  });
});
