import { SaveSurveyResultController } from "./save-survey-result-controller";
import { InvalidParamError } from "@/presentation/errors";
import MockDate from "mockdate";
import {
  HttpRequest,
  LoadSurveyById,
  SaveSurveyResult,
} from "./save-survey-result-controller-protocols";
import {
  forbidden,
  ok,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { mockSurveyResultModel, throwError } from "@/domain/test";
import { mockLoadSurveyById, mockSaveSurveyResult } from "@/presentation/test";

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: "any_survey_id",
  },
  body: {
    answer: "any_answer",
  },
  accountId: "any_account_id",
});

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyById: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
};

const makeSut = (): SutTypes => {
  const loadSurveyById = mockLoadSurveyById();
  const saveSurveyResultStub = mockSaveSurveyResult();
  const sut = new SaveSurveyResultController(
    loadSurveyById,
    saveSurveyResultStub
  );
  return {
    sut,
    loadSurveyById,
    saveSurveyResultStub,
  };
};

describe("SaveSurveyResultController", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test("should call LoadSurveyById with correct values", async () => {
    const { sut, loadSurveyById } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyById, "loadById");
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(loadByIdSpy).toHaveBeenCalledWith(httpRequest.params.surveyId);
  });

  test("should return 403 if LoadSurveyById returns null", async () => {
    const { sut, loadSurveyById } = makeSut();
    jest
      .spyOn(loadSurveyById, "loadById")
      .mockReturnValueOnce(Promise.resolve(null));
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError("surveyId")));
  });

  test("should return 500 if LoadSurveyById throws", async () => {
    const { sut, loadSurveyById } = makeSut();

    jest.spyOn(loadSurveyById, "loadById").mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("should return 403 f an invalid answer is provided", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      params: {
        surveyId: "any_survey_id",
      },
      body: {
        answer: "wrong_answer",
      },
    });
    expect(httpResponse).toEqual(forbidden(new InvalidParamError("answer")));
  });

  test("should call SaveSurveyResult with correct values", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const loadByIdSpy = jest.spyOn(saveSurveyResultStub, "save");
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(loadByIdSpy).toHaveBeenCalledWith({
      surveyId: "any_survey_id",
      accountId: "any_account_id",
      date: new Date(),
      answer: "any_answer",
    });
  });

  test("should return 500 if SaveSurveyResult throws", async () => {
    const { sut, saveSurveyResultStub } = makeSut();

    jest.spyOn(saveSurveyResultStub, "save").mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("should return 500 if SaveSurveyResult throws", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()));
  });
});
