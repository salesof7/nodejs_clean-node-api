import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  Encrypter,
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);

    return await new Promise((resolve) =>
      resolve({
        id: "account_id",
        name: "account_name",
        email: "account_email",
        password: "account_password",
      })
    );
  }
}
