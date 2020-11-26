import { createConnection, getConnection, Connection } from "typeorm";
import { Account } from "./entity/Account";
import { Currency } from "./entity/Currency";
import { Transaction } from "./entity/Transaction";
import { Institution } from "./entity/Institution";

export class DBConnection {
  /**
   * Connect to the OpenWallet Database, using environment
   * variables to determine where to connect to
   */
  static async init(): Promise<Connection | null> {
    console.log(`Connecting to db at ${process.env.OW_DATABASE_HOST}:${process.env.OW_DATABASE_PORT}`);
    return await createConnection({
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
      .then((conn: Connection) => {
        console.log(
          `Conected to db ${process.env.OW_DATABASE_NAME} at ${process.env.OW_DATABASE_HOST}:${process.env.OW_DATABASE_PORT}`
        );
        return conn;
      })
      .catch((err) => {
        console.error(
          `Could not connect to db ${process.env.OW_DATABASE_NAME} at ${process.env.OW_DATABASE_HOST}:${process.env.OW_DATABASE_PORT}`
        );
        console.error(err);
        return null;
      });
  }

  /**
   * Fetch the current connection to the db
   */
  static get connection(): Connection {
    return getConnection();
  }

  static async close(): Promise<void> {
    await this.connection.close();
  }

  /**
   * Mainly for testing purposes, clears all the tables for the entire db
   */
  static async clear(): Promise<void> {
    await this.connection.dropDatabase();
    await this.connection.synchronize();
  }
}

/**
 * Helper type containing all of the OWEntity's
 */
export type OWEntity = Account | Currency | Institution | Transaction;
