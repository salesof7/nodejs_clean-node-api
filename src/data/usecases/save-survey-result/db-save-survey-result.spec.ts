import { SaveSurveyResultRepository } from "@/data/protocols/db/survey/save-survey-result-repository";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultModel } from "@/domain/usecases/save-survey-result";
import MockDate from "mockdate";
import { DbSaveSurveyResult } from "./db-save-survey-result";

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: "any_id",
  accountId: "any_id",
  surveyId: "any_id",
  answer: "any_answer",
  date: new Date(),
});

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
  accountId: "any_id",
  surveyId: "any_id",
  answer: "any_answer",
  date: new Date(),
});

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise((resolve) => {
        resolve(makeFakeSurveyResult());
      });
    }
  }
  return new SaveSurveyResultRepositoryStub();
};

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
  return {
    sut,
    saveSurveyResultRepositoryStub,
  };
};

describe("DbSaveSurveyResult UseCase", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test("should call SaveSurveyResultRepository with correct values", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, "save");
    const surveyResultData = makeFakeSurveyResultData();
    await sut.save(surveyResultData);
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData);
  });
});