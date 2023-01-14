import { forbidden } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../errors";
import { AuthMiddleware } from "./auth-middleware";
import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token";
import { AccountModel } from "../../domain/models/account";

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "hashed_password",
});

describe("Auth Middleware", () => {
  test("should return 403 if no x-access-token exists in headers", async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load(accessToken: string, role?: string): Promise<AccountModel> {
        return await new Promise((resolve) => makeFakeAccount());
      }
    }

    const loadAccountByTokenStub = new LoadAccountByTokenStub();
    const sut = new AuthMiddleware(loadAccountByTokenStub);
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test("should call LoadAccountByToken with correct accessToken", async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load(accessToken: string, role?: string): Promise<AccountModel> {
        return await new Promise((resolve) => resolve(makeFakeAccount()));
      }
    }

    const loadAccountByTokenStub = new LoadAccountByTokenStub();
    const sut = new AuthMiddleware(loadAccountByTokenStub);

    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");
    await sut.handle({
      headers: {
        "x-access-token": "any_token",
      },
    });
    expect(loadSpy).toHaveBeenCalledWith("any_token");
  });
});