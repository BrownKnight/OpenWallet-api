import { Column, Entity } from "typeorm";
import { CredentialsType } from "./enum/CredentialsType";
import { DataSource } from "./enum/DataSource";
import { OWEntity } from "./OWEntity";

@Entity()
export class Institution extends OWEntity {
  @Column({ type: "character varying", nullable: true })
  external_id?: string;

  @Column({ type: "character varying" })
  fullName!: string;

  @Column({ type: "character varying" })
  credentialsType!: CredentialsType;

  @Column({ type: "character varying" })
  dataSource!: DataSource;
}
