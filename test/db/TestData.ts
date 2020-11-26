import { InstitutionDAO } from "@db/DAO/InstitutionDAO";
import { CredentialsType } from "@db/entity/enum/CredentialsType";
import { DataSource } from "@db/entity/enum/DataSource";
import { Institution } from "@db/entity/Institution";

export class TestData {
  static get institutions(): Institution[] {
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

export class TestDataGenerator {
  static createBaseTestData(): void {
    this.createInstitutionData();
  }

  static createInstitutionData(): void {
    const dao = new InstitutionDAO();
    dao.saveMultiple(TestData.institutions);
  }
}
