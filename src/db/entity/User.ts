import { Column, Entity } from "typeorm";
import { OWEntity } from "./OWEntity";

@Entity()
export class User extends OWEntity {
  @Column({ type: "character varying" })
  firstName!: string;

  @Column({ type: "character varying" })
  lastName!: string;

  @Column({ type: "character varying", unique: true })
  emailAddress!: string;
}
