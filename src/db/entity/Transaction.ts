import { Column, Entity, ManyToOne } from "typeorm";
import { Currency } from "./Currency";
import { OWEntity } from "./OWEntity";

@Entity()
export class Transaction extends OWEntity {
  @Column({ type: "character varying", nullable: true })
  external_id?: string;

  @ManyToOne(() => Currency)
  currency!: Currency;

  @Column({ type: "decimal" })
  monetaryAmount!: number;
}
