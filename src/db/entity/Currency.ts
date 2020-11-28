import { Column, Entity } from "typeorm";
import { OWEntity } from "./OWEntity";

@Entity()
export class Currency extends OWEntity {
  @Column({ type: "character varying" })
  currencyCode!: string;

  @Column({ type: "character varying" })
  currencySymbol!: string;
}
