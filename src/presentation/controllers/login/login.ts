import { Authentication } from "../../../domain/usecases/authentication";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { EmailValidator } from "../signup/signup-protocols";

export class LoginController implements Controller {
  private readonly emailValidatorStub: EmailValidator;
  private readonly authentication: Authentication;

  constructor(
    emailValidatorStub: EmailValidator,
    authentication: Authentication
  ) {
    this.emailValidatorStub = emailValidatorStub;
    this.authentication = authentication;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;

      if (!email) {
        return await new Promise((resolve) =>
          resolve(badRequest(new MissingParamError("email")))
        );
      }

      if (!password) {
        return await new Promise((resolve) =>
          resolve(badRequest(new MissingParamError("password")))
        );
      }

      const isValid = this.emailValidatorStub.isValid(email);

      if (!isValid) {
        return await new Promise((resolve) =>
          resolve(badRequest(new InvalidParamError("email")))
        );
      }

      await this.authentication.auth(email, password);

      return null as unknown as HttpResponse;
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
