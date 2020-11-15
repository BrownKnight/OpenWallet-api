import pkg from "typeorm";
import { Institution } from "./Institution.js";
import { BaseEntity } from "./OWEntity.js";
const { Column, Entity, ManyToOne } = pkg;

@Entity()
export class Account extends BaseEntity {
  @Column({ type: "character varying", nullable: true })
  external_id?: string;

  @Column({ type: "character varying" })
  name?: string;

  @ManyToOne(() => Institution)
  institution?: Institution;
}
