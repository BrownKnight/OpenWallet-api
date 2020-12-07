import { EntityRouter } from "@api/EntityRouter";
import { Currency } from "@db/entity/Currency";
import { CurrencyService } from "@service/CurrencyService";

export class CurrenciesRouter extends EntityRouter<Currency, CurrencyService> {
  constructor() {
    super(CurrencyService);
  }

  initRoutes(): void {
    // No extra routes
  }
}
