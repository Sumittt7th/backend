import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn,JoinColumn } from "typeorm";
import { Video } from "../video/video.entity";  
import { User } from "../user/user.entity";  
import { IAnalytics } from "./analytics.dto";  
@Entity()
export class Analytics implements IAnalytics {
  @PrimaryGeneratedColumn("uuid")
  _id!: string;  

  @ManyToOne(() => User) 
  @JoinColumn({ name: "userId" }) 
  userId!: User; 

  @ManyToOne(() => Video) 
  @JoinColumn({ name: "videoId" })
  videoId!: Video;

  @Column({ type: "int", default: 0 })
  views!: number; 

  @CreateDateColumn()
  createdAt!: Date;  

  @UpdateDateColumn()
  updatedAt!: Date;  

  
}