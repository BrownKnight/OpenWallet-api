import pkg from "typeorm";
import { BaseEntity } from "./OWEntity.js";
const { Column, Entity } = pkg;

@Entity()
export class Currency extends BaseEntity {
  @Column({ type: "character varying" })
  currencyCode?: string;

  @Column({ type: "character varying" })
  currencySymbol?: string;
}
