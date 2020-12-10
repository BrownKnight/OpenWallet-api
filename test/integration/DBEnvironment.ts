/**
 * Looks like this environment won't be supported until Jest 27 comes out
 */

import { DB, InMemoryPostgresDB } from "@db/db";
import NodeEnvironment from "jest-environment-node";
import { Script } from "vm";
export class DBEnvironment extends NodeEnvironment {
  async setup(): Promise<void> {
    await DB.init();
  }

  runScript<T = unknown>(script: Script): T | null {
    (DB as typeof InMemoryPostgresDB).restoreDB();
    return super.runScript<T>(script);
  }

  async teardown(): Promise<void> {
    await DB.close();
  }
}
