import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Address } from "./entity/address.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "rootuser",
  database: "test",
  synchronize: true,
  logging: false,
  entities: [User, Address],
  migrations: [],
  subscribers: [],
});
