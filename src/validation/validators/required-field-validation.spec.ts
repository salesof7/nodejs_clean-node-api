import { MissingParamError } from "../../presentation/errors";
import { RequiredFieldValidation } from "./required-field-validation";

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation("field");
};

describe("RequiredField Validation", () => {
  test("should return a MissingParamError if validation fails", () => {
    const sut = makeSut();
    const error = sut.validate({ name: "any_name" });
    expect(error).toEqual(new MissingParamError("field"));
  });

  test("should not return if validation success", () => {
    const sut = makeSut();
    const error = sut.validate({ field: "any_field" });
    expect(error).toBeFalsy();
  });
});
