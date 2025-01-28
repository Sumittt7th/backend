import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5433,
  username: "postgres",
  password: "1234",
  database: "Video_Streaming",
  synchronize: true, 
  logging: false,
  entities:[
    "app/user/user.entity.ts",
  ],
  migrations: ["app/common/migration/migration.ts"],
});
