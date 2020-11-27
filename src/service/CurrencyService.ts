import { CurrencyDAO } from "@db/DAO/CurrencyDAO";
import { Currency } from "@db/entity/Currency";
import { BaseEntityService } from "@service/BaseEntityService";

export class CurrencyService extends BaseEntityService<Currency> {
  constructor() {
    super(CurrencyDAO);
  }
}
