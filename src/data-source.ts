import "reflect-metadata"
import { DataSource } from "typeorm"
import { Contact } from "./entity/Contact"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.NODE_POSTGRES_HOST,
    port: 5432,
    username: process.env.NODE_POSTGRES_USER,
    password: process.env.NODE_POSTGRES_PASSWORD,
    database: process.env.NODE_POSTGRES_DBNAME,
    synchronize: true,
    logging: false,
    entities: [Contact],
    migrations: [],
    subscribers: [],
})
