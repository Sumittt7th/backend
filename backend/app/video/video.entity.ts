import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IVideo } from "./video.dto"; // Adjust the import path as needed

@Entity()
export class Video implements IVideo {
  @PrimaryGeneratedColumn("uuid")
  _id!: string; // UUID to match _id in MongoDB

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", nullable: true })
  url!: string;

  @Column({ type: "varchar", nullable: true })
  hlsUrl!: string;

  @Column({ type: "int", nullable: true })
  duration?: number;

  @Column({
    type: "enum",
    enum: ["free", "paid"],
    default: "free",
  })
  access!: "free" | "paid";

  @Column({ type: "int", default: 0 })
  viewCount!: number;

  @Column({ type: "varchar", nullable: true })
  public_id!: string;

  @CreateDateColumn()
  createdAt!: Date;  // Created at timestamp

  @UpdateDateColumn()
  updatedAt!: Date;  // Updated at timestamp
}
