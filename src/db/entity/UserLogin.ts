import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from "typeorm";
import { OWEntity } from "./OWEntity";
import { User } from "./User";
import bcrypt from "bcrypt";
import { UserRole } from "./enum/UserRole";

@Entity()
export class UserLogin extends OWEntity {
  @OneToOne(() => User)
  user?: User;

  /** Should be the user's email address */
  @Column({ type: "character varying", unique: true })
  username!: string;

  @Column({ type: "character varying", select: false })
  password?: string;

  @Column({ type: "enum", enum: UserRole })
  userRole!: UserRole;

  @Column({ type: "character varying", select: false, nullable: true })
  webToken?: string;

  @BeforeInsert()
  @BeforeUpdate()
  encryptPassword?(): void {
    // If password is included in the request to update, then we assume its a new plaintext
    if (this.password) {
      // console.log(`Password present on entity ${this.id}, hashing it`);
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }
}
