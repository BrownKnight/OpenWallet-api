import { MockBaseDAO } from "@test/db/mock/MockBaseDAO";

jest.mock("@db/DAO/BaseDAO", () => {
  return {
    BaseDAO: jest.fn().mockImplementation((entityClass) => {
      return new MockBaseDAO(entityClass);
    }),
  };
});
