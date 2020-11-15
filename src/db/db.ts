import pkg from "typeorm";
import { Account } from "./entity/Account.js";
import { Currency } from "./entity/Currency.js";
import { Transaction } from "./entity/Transaction.js";
import { Institution } from "./entity/Institution.js";
const { createConnection } = pkg;

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
    entities: [Institution, Account, Currency, Transaction],
    synchronize: true,
    //logging: true,
  })
    .then(() => {
      console.log(
        `Conected to db ${process.env.OW_DATABASE_NAME} at ${process.env.OW_DATABASE_HOST}:${process.env.OW_DATABASE_PORT}`
      );
    })
    .catch((err) => {
      console.error(
        `Could not connect to db ${process.env.OW_DATABASE_NAME} at ${process.env.OW_DATABASE_HOST}:${process.env.OW_DATABASE_PORT}`
      );
      console.error(err);
    });
}
