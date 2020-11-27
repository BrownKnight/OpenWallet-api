import { OWEntity } from "@db/entity/OWEntity";

export class ServiceResponse<TEntity extends OWEntity> {
  success: boolean;
  entities?: TEntity[];
  message?: string;
  errorCode?: number;
  errorMessage?: string;

  constructor(success?: boolean, entities?: TEntity[], message?: string, errorCode?: number, errorMessage?: string) {
    this.success = success ?? true;
    this.entities = entities;
    this.message = message;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }
}
