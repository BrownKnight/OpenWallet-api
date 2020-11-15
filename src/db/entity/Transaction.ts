import pkg from "typeorm";
import { Currency } from "./Currency.js";
import { BaseEntity } from "./OWEntity.js";
const { Column, Entity, ManyToOne } = pkg;

@Entity()
export class Transaction extends BaseEntity {
  @Column({ type: "character varying", nullable: true })
  external_id?: string;

  @ManyToOne(() => Currency)
  currency?: Currency;

  @Column({ type: "decimal" })
  monetaryAmount?: number;
}
