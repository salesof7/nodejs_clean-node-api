import { DbLoadSurveyById } from "./db-load-survey-by-id";
import {
  SurveyModel,
  LoadSurveyByIdRepository,
} from "./db-load-survey-by-id-protocols";
import MockDate from "mockdate";

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: "any_id",
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
    date: new Date(),
  };
};

const makeLoadSurveysRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return await new Promise((resolve) => {
        resolve(makeFakeSurvey());
      });
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveysRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
  return {
    sut,
    loadSurveyByIdRepositoryStub,
  };
};

describe("DbLoadSurveyById", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test("should call LoadSurveyByIdRepository with correct id", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, "loadById");
    await sut.loadById("any_id");
    expect(loadByIdSpy).toHaveBeenCalledWith("any_id");
  });

  test("should return survey on success", async () => {
    const { sut } = makeSut();
    const surveys = await sut.loadById("any_id");
    expect(surveys).toEqual(makeFakeSurvey());
  });

  test("should throw if LoadSurveyByIdRepository throws", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();

    jest.spyOn(loadSurveyByIdRepositoryStub, "loadById").mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error());
      })
    );

    const promise = sut.loadById("any_id");
    await expect(promise).rejects.toThrow();
  });
});