import { AddSurveyModel, AddSurveyRepository } from "./db-add-survey-protocols";
import { DbAddSurvey } from "./db-add-survey";

const makeSurveyData = (): AddSurveyModel => ({
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
});

describe("DbAddSurvey UseCase", () => {
  test("should call AddSurveyRepository with correct values", async () => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add(surveyData: AddSurveyModel): Promise<void> {
        return await new Promise((resolve) => resolve());
      }
    }
    const addSurveyRepositoryStub = new AddSurveyRepositoryStub();
    const sut = new DbAddSurvey(addSurveyRepositoryStub);
    const addSpy = jest.spyOn(addSurveyRepositoryStub, "add");
    const surveyData = makeSurveyData();
    await sut.add(surveyData);
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });
});
