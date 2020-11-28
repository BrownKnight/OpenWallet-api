import { PrimaryGeneratedColumn, UpdateDateColumn, ObjectLiteral } from "typeorm";
//const { PrimaryGeneratedColumn, UpdateDateColumn } = pkg;

/**
 * Base entity for all OpenWallet entities, providing consistent id's and dateModifed columns
 */
export class OWEntity implements ObjectLiteral {
  @PrimaryGeneratedColumn()
  id!: number;

  @UpdateDateColumn({ type: "timestamp" })
  dateModified!: Date;
}
