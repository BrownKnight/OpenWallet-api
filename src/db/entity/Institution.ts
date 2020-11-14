import pkg from "typeorm";
import { CredentialsType } from "./enum/CredentialsType.js";
import { BaseEntity } from "./OWEntity.js";
const { Column } = pkg;

export class Insitution extends BaseEntity {
  @Column({ type: "character varying" })
  external_id?: string;

  @Column({ type: "character varying" })
  fullName?: string;

  @Column({ type: "character varying", enum: CredentialsType })
  credentialsType?: CredentialsType;

  // @Column({ type: "character varying" })
  // fullName?: string;

  // @Column({ type: "character varying" })
  // fullName?: string;

  // @Column({ type: "character varying" })
  // fullName?: string;
}
