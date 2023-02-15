import { DbAuthentication } from "./db-authentication";
import {
  AccountModel,
  Authentication,
  AuthenticationParams,
  HashComparer,
  LoadAccountByEmailRepository,
  Encrypter,
  UpdateAccessTokenRepository,
} from "./db-authentication-protocols";

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async loadByEmail(email: string): Promise<AccountModel> {
      return await new Promise((resolve) => {
        resolve(makeFakeAccount());
      });
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return await new Promise((resolve) => {
        resolve(true);
      });
    }
  }
  return new HashComparerStub();
};

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await new Promise((resolve) => {
        resolve("any_token");
      });
    }
  }
  return new EncrypterStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      await new Promise<void>((resolve) => {
        resolve();
      });
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};

type SutTypes = {
  sut: Authentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const encrypterStub = makeEncrypter();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  };
};

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "hash_password",
});

const makeFakeAuthentication = (): AuthenticationParams => ({
  email: "any_email@mail.com",
  password: "any_password",
});

describe("DbAuthentication UseCase", () => {
  test("should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");

    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("should throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => {
          reject(new Error());
        })
      );

    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("should return null if LoadAccountByEmailRepository returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolve(null as unknown as AccountModel);
        })
      );

    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
  });

  test("should call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut();

    const compareSpy = jest.spyOn(hashComparerStub, "compare");

    await sut.auth(makeFakeAuthentication());
    expect(compareSpy).toHaveBeenCalledWith("any_password", "hash_password");
  });

  test("should throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut();

    jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error());
      })
    );

    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("should return null if HashComparer returns false", async () => {
    const { sut, hashComparerStub } = makeSut();

    jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(
      new Promise((resolve) => {
        resolve(false);
      })
    );

    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
  });

  test("should call Encrypter with correct id", async () => {
    const { sut, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");

    await sut.auth(makeFakeAuthentication());
    expect(encryptSpy).toHaveBeenCalledWith("any_id");
  });

  test("should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();

    jest.spyOn(encrypterStub, "encrypt").mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error());
      })
    );

    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("should return a token on success", async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBe("any_token");
  });

  test("should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      "updateAccessToken"
    );

    await sut.auth(makeFakeAuthentication());
    expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token");
  });

  test("should throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => {
          reject(new Error());
        })
      );

    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });
});