import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from "typeorm";
import { OWEntity } from "./OWEntity";
import { User } from "./User";
import bcrypt from "bcrypt";

@Entity()
export class UserLogin extends OWEntity {
  @OneToOne(() => User)
  user?: User;

  /** Should be the user's email address */
  @Column({ type: "character varying" })
  username!: string;

  @Column({ type: "character varying" })
  password!: string;

  @BeforeInsert()
  @BeforeUpdate()
  encryptPassword?(): void {
    // If password is included in the request to update, then we assume its a new plaintext
    if (this.password) {
      console.log("Password present on entity, hashing it");
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }
}
