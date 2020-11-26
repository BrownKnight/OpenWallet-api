import { Column, Entity, ManyToOne } from "typeorm";
import { Institution } from "./Institution";
import { OWEntity } from "./OWEntity";

@Entity()
export class Account extends OWEntity {
  @Column({ type: "character varying", nullable: true })
  external_id?: string;

  @Column({ type: "character varying" })
  name?: string;

  @ManyToOne(() => Institution)
  institution?: Institution;
}
