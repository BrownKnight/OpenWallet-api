import { createConnection, getConnection, Connection, Repository, EntityTarget } from "typeorm";
import { Account } from "./entity/Account";
import { Currency } from "./entity/Currency";
import { Transaction } from "./entity/Transaction";
import { Institution } from "./entity/Institution";
import { UserLogin } from "./entity/UserLogin";
import { User } from "./entity/User";
import { OWEntity } from "./entity/OWEntity";
// import { IBackup, newDb } from "pg-mem";

/**
 * Helper type containing all of the OWEntity's
 */
export type AnyOWEntity = Account | Currency | Institution | Transaction | User | UserLogin | OWEntity;

class PostgresDB {
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
      entities: [Account, Currency, Institution, Transaction, User, UserLogin],
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

// class InMemoryPostgresDB {
//   static backup: IBackup | undefined;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   static orm: any;

//   static async init(): Promise<Connection | null> {
//     console.log("Connecting to in memory db");
//     // close old instance
//     // (typeorm has static stuff which prevents intiating multiple connection)
//     await this.orm?.close();

//     // create new instance
//     const db = newDb({
//       // 👉 Recommanded when using Typeorm .synchronize(), which creates foreign keys but not indices !
//       autoCreateForeignKeyIndices: true,
//     });
//     const connection = await db.adapters.createTypeormConnection({
//       type: "postgres",
//       entities: [Institution],
//     });

//     if (!this.backup) {
//       console.log("Syncing DB Schema");
//       // this is the first test to run using this schema
//       // ... lets create your tables
//       //   (if you have thousands, this could be heavy)
//       await connection.synchronize();
//       console.log("Backup DB");
//       // Then, create a backup of this empty database with created schema
//       // nb: this is instantaneous (o(1))
//       this.backup = db.backup();
//     } else {
//       // Okay, a previous test already create the DB schema
//       // => lets restore data as it was after schema creation
//       // nb: this is instantaneous (o(1))
//       console.log("Restoring DB");
//       this.backup?.restore();
//     }

//     return this.orm;
//   }

//   /**
//    * Fetch the current connection to the db
//    */
//   static get connection(): Connection {
//     return this.orm ?? this.init();
//   }

//   /**
//    * Fetch a repository from the current connection
//    */
//   static getRepository<TEntity extends AnyOWEntity>(entityClass: EntityTarget<TEntity>): Repository<TEntity> {
//     return this.connection.getRepository(entityClass);
//   }

//   static async close(): Promise<void> {
//     if (this.connection.isConnected) {
//       await this.connection.close();
//     }
//   }
// }

export const DB = PostgresDB;
