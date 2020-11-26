import { CredentialsType } from "../../src/db/entity/enum/CredentialsType";
import { DataSource } from "../../src/db/entity/enum/DataSource";
import { Institution } from "../../src/db/entity/Institution";

export class TestData {
  get institutions(): Institution[] {
    return [
      {
        id: 1,
        credentialsType: CredentialsType.OAUTH2,
        dataSource: DataSource.LOCAL,
        fullName: "Test Institution 1",
      },
    ];
  }
}
