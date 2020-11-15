import pkg from "typeorm";
import { Institution } from "./Institution.js";
import { OWEntity } from "./OWEntity.js";
const { Column, Entity, ManyToOne } = pkg;

@Entity()
export class Account extends OWEntity {
  @Column({ type: "character varying", nullable: true })
  external_id?: string;

  @Column({ type: "character varying" })
  name?: string;

  @ManyToOne(() => Institution)
  institution?: Institution;
}
