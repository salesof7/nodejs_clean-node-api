import { makeSurveyValidation } from "./add-survey-validation-factory";
import { Validation } from "@/presentation/protocols/validation";
import {
  RequiredFieldValidation,
  ValidationComposite,
} from "@/validation/validators";

jest.mock("@/validation/validators/validation-composite");

describe("AddSurveyValidation Factory", () => {
  test("should call ValidationComposite with all validations", () => {
    makeSurveyValidation();
    const validations: Validation[] = [];
    for (const field of ["question", "answers"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
