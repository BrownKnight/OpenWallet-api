import pkg from "typeorm";
const { PrimaryGeneratedColumn, UpdateDateColumn } = pkg;

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @UpdateDateColumn({ type: "timestamp" })
  dateModified?: Date;
}
