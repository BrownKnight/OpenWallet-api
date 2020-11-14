import pkg from "typeorm";
import { CredentialsType } from "./enum/CredentialsType.js";
import { DataSource } from "./enum/DataSource.js";
import { BaseEntity } from "./OWEntity.js";
const { Column, Entity } = pkg;

@Entity()
export class Institution extends BaseEntity {
  @Column({ type: "character varying" })
  external_id?: string;

  @Column({ type: "character varying" })
  fullName?: string;

  @Column({ type: "enum", enum: CredentialsType })
  credentialsType?: CredentialsType;

  @Column({ type: "enum", enum: DataSource })
  dataSource?: DataSource;
}
