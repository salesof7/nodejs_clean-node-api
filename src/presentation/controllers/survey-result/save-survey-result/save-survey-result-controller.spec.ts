import { SaveSurveyResultController } from "./save-survey-result-controller";
import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel,
  forbidden,
  serverError,
  InvalidParamError,
} from "./save-survey-result-controller-protocols";
import MockDate from "mockdate";
import {
  SaveSurveyResult,
  SaveSurveyResultModel,
} from "@/domain/usecases/survey-result/save-survey-result";
import { SurveyResultModel } from "@/domain/models/survey-result";

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: "any_survey_id",
  },
  body: {
    answer: "any_answer",
  },
  accountId: "any_account_id",
});

const makeFakeSurvey = (): SurveyModel => ({
  id: "any_id",
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
  date: new Date(),
});

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: "valid_id",
  surveyId: "valid_survey_id",
  accountId: "valid_account_id",
  date: new Date(),
  answer: "valid_answer",
});

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return await new Promise((resolve) => {
        resolve(makeFakeSurvey());
      });
    }
  }
  return new LoadSurveyByIdStub();
};

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise((resolve) => {
        resolve(makeFakeSurveyResult());
      });
    }
  }
  return new SaveSurveyResultStub();
};

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyById: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
};

const makeSut = (): SutTypes => {
  const loadSurveyById = makeLoadSurveyById();
  const saveSurveyResultStub = makeSaveSurveyResult();
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
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(loadByIdSpy).toHaveBeenCalledWith(httpRequest.params.surveyId);
  });

  test("should return 403 if LoadSurveyById returns null", async () => {
    const { sut, loadSurveyById } = makeSut();
    jest.spyOn(loadSurveyById, "loadById").mockReturnValueOnce(
      new Promise((resolve) => {
        resolve(null);
      })
    );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError("surveyId")));
  });

  test("should return 500 if LoadSurveyById throws", async () => {
    const { sut, loadSurveyById } = makeSut();

    jest.spyOn(loadSurveyById, "loadById").mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error());
      })
    );

    const httpResponse = await sut.handle(makeFakeRequest());
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
    const httpRequest = makeFakeRequest();
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

    jest.spyOn(saveSurveyResultStub, "save").mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error());
      })
    );

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
