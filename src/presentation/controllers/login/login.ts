import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { EmailValidator } from "../signup/signup-protocols";

export class LoginController implements Controller {
  private readonly emailValidatorStub: EmailValidator;

  constructor(emailValidatorStub: EmailValidator) {
    this.emailValidatorStub = emailValidatorStub;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return await new Promise((resolve) =>
        resolve(badRequest(new MissingParamError("email")))
      );
    }

    if (!httpRequest.body.password) {
      return await new Promise((resolve) =>
        resolve(badRequest(new MissingParamError("password")))
      );
    }

    const isValid = this.emailValidatorStub.isValid(httpRequest.body.email);

    if (!isValid) {
      return await new Promise((resolve) =>
        resolve(badRequest(new InvalidParamError("email")))
      );
    }

    return null as unknown as HttpResponse;
  }
}
