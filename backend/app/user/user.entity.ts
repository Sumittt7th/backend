import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, UpdateDateColumn } from "typeorm";
import bcrypt from "bcrypt";
import { IUser } from "./user.dto"; // Adjust the import path as needed

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn("uuid")
  _id!: string; // UUID instead of auto-incremented ID to match _id in MongoDB

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "boolean", default: true })
  active!: boolean;

  @Column({
    type: "enum",
    enum: ["USER", "ADMIN"],
    default: "USER",
  })
  role!: "USER" | "ADMIN";

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "varchar", nullable: true })
  refToken!: string | "";

  @Column({ type: "boolean" })
  subscription!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }
}
