import { Column, Entity, ManyToOne } from "typeorm";
import { Account } from "./Account";
import { Currency } from "./Currency";
import { OWEntity } from "./OWEntity";

@Entity()
export class Transaction extends OWEntity {
  @Column({ type: "character varying", nullable: true })
  external_id?: string;

  @ManyToOne(() => Currency)
  currency!: Currency;

  @ManyToOne(() => Account)
  account!: Account;

  @Column({ type: "decimal" })
  monetaryAmount!: number;
}
