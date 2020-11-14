import pkg from "typeorm";
const { createConnection } = pkg;
import { Insitution } from "./entity/Institution.js";

export async function initDb(): Promise<void> {
  console.log(
    `Connecting to db at ${process.env.OW_DATABASE_HOST}:${process.env.OW_DATABASE_PORT}`
  );
  await createConnection({
    type: "postgres",
    host: process.env.OW_DATABASE_HOST,
    port: parseInt(process.env.OW_DATABASE_PORT ?? ""),
    username: process.env.OW_DATABASE_USERNAME,
    password: process.env.OW_DATABASE_PASSWORD,
    database: process.env.OW_DATABASE_NAME,
    entities: [Insitution],
    synchronize: true,
    //logging: true,
  })
    .then(() => {
      console.log(
        `Conected to db at ${process.env.OW_DATABASE_HOST}:${process.env.OW_DATABASE_PORT}`
      );
    })
    .catch((err) => {
      console.error(
        `Could not connect to db at ${process.env.OW_DATABASE_HOST}:${process.env.OW_DATABASE_PORT}`
      );
      console.error(err);
    });
}
