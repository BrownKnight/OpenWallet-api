import { UpdateDateColumn, ObjectLiteral, Column, PrimaryGeneratedColumn } from "typeorm";
//const { PrimaryGeneratedColumn, UpdateDateColumn } = pkg;

/**
 * Base entity for all OpenWallet entities, providing consistent id's and dateModifed columns
 */
export class OWEntity implements ObjectLiteral {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @UpdateDateColumn({ type: "timestamp" })
  dateModified?: Date;

  /**
   * Every entity is scoped to a specific userId, and only a user with that id can fetch/delete it.
   * A null user id implies it is a system-level entity, so can be managed only by Admins.
   * */
  @Column({ type: "int" })
  owningUserId!: number;
}
