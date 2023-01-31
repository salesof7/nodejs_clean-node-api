import { InvalidParamError } from "@/presentation/errors";
import {
  forbidden,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { SaveSurveyResultController } from "./save-survey-result-controller";
import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel,
} from "./save-survey-result-controller-protocols";

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: "any_survey_id",
  },
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

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyById: LoadSurveyById;
};

const makeSut = (): SutTypes => {
  const loadSurveyById = makeLoadSurveyById();
  const sut = new SaveSurveyResultController(loadSurveyById);
  return {
    sut,
    loadSurveyById,
  };
};

describe("SaveSurveyResultController", () => {
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
});
