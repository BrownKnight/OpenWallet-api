import pkg from "typeorm";
import { OWEntity } from "./OWEntity.js";
const { Column, Entity } = pkg;

@Entity()
export class Currency extends OWEntity {
  @Column({ type: "character varying" })
  currencyCode?: string;

  @Column({ type: "character varying" })
  currencySymbol?: string;
}
