import { Currency } from "@db/entity/Currency";
import { BaseDAO } from "./BaseDAO";

export class CurrencyDAO extends BaseDAO<Currency> {
  constructor(userId: number) {
    super(Currency, userId);
  }
}
