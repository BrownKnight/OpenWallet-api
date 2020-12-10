import { createConnection, getConnection, Connection, Repository, EntityTarget } from "typeorm";
import { Account } from "./entity/Account";
import { Currency } from "./entity/Currency";
import { Transaction } from "./entity/Transaction";
import { Institution } from "./entity/Institution";
import { UserLogin } from "./entity/UserLogin";
import { User } from "./entity/User";
import { OWEntity } from "./entity/OWEntity";
import { IBackup, IMemoryDb, newDb } from "pg-mem";

/**
 * Helper type containing all of the OWEntity's
 */
export type AnyOWEntity = Account | Currency | Institution | Transaction | User | UserLogin | OWEntity;

class PostgresDB {
  /**
   * Connect to the OpenWallet Database, using environment
   * variables to determine where to connect to
   */
  static async init(connectionName = "default"): Promise<Connection | null> {
    console.log(`Connecting to db at ${process.env.OW_DATABASE_HOST}:${process.env.OW_DATABASE_PORT}`);
    return await createConnection({
      type: "postgres",
      host: process.env.OW_DATABASE_HOST,
      port: parseInt(process.env.OW_DATABASE_PORT ?? ""),
      username: process.env.OW_DATABASE_USERNAME,
      password: process.env.OW_DATABASE_PASSWORD,
      database: process.env.OW_DATABASE_NAME,
      entities: [Account, Currency, Institution, Transaction, User, UserLogin],
      synchronize: true,
      name: connectionName,
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

  /**
   * Fetch a repository from the current connection
   */
  static getRepository<TEntity extends AnyOWEntity>(entityClass: EntityTarget<TEntity>): Repository<TEntity> {
    return this.connection.getRepository(entityClass);
  }

  static async close(): Promise<void> {
    if (this.connection.isConnected) {
      await this.connection.close();
    }
  }
}

class InMemoryPostgresDB {
  static backup: IBackup | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static orm: any;
  static db: IMemoryDb;

  static async init(connectionName = ""): Promise<Connection | null> {
    if (connectionName == "") {
      connectionName = `connection_${process.env.JEST_WORKER_ID}`;
    }
    if (process.env.TEST_LOGGING) console.log(`Connecting to in memory db ${connectionName}`);
    // if (this.orm && this.orm.isConnected && this.backup) {
    //   console.log("Restoring DB!");
    //   this.backup.restore();
    //   return this.orm;
    // }
    // await this.orm?.close();

    // create new instance
    this.db = newDb({
      // 👉 Recommanded when using Typeorm .synchronize(), which creates foreign keys but not indices !
      autoCreateForeignKeyIndices: true,
    });
    this.orm = await this.db.adapters.createTypeormConnection({
      type: "postgres",
      entities: [Account, Currency, Institution, Transaction, User, UserLogin],
      name: `database_${process.env.JEST_WORKER_ID}`,
      database: process.env.OW_DATABASE_NAME,
      //logging: true,
    });

    if (!this.backup) {
      if (process.env.TEST_LOGGING) console.log("Syncing DB Schema");
      await this.orm.synchronize();
      this.backupDB();
    } else {
      this.restoreDB();
    }
    if (process.env.TEST_LOGGING) console.log("DB Ready");
    return this.orm;
  }

  /**
   * Fetch the current connection to the db
   */
  static get connection(): Connection {
    return this.orm;
  }

  /**
   * Fetch a repository from the current connection
   */
  static getRepository<TEntity extends AnyOWEntity>(entityClass: EntityTarget<TEntity>): Repository<TEntity> {
    return this.connection?.getRepository(entityClass);
  }

  static async close(): Promise<void> {
    if (this.connection?.isConnected) {
      await this.connection.close();
    }
  }

  static backupDB(): void {
    if (process.env.TEST_LOGGING) console.log("Backup DB");
    // Then, create a backup of this empty database with created schema
    // nb: this is instantaneous (o(1))
    this.backup = this.db.backup();
  }

  static restoreDB(): void {
    if (process.env.TEST_LOGGING) console.log("Restoring DB");
    this.backup?.restore();
  }
}

export const DB: typeof InMemoryPostgresDB | typeof PostgresDB = process.env.OW_DATABASE_TEST
  ? InMemoryPostgresDB
  : PostgresDB;
export type { InMemoryPostgresDB, PostgresDB };
