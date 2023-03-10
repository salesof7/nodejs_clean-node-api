import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultParams } from "@/domain/usecases/survey-result/save-survey-result";

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: "any_id",
  surveyId: "any_id",
  answer: "any_answer",
  date: new Date(),
});

export const mockSurveyResultModel = (): SurveyResultModel =>
  Object.assign({}, mockSaveSurveyResultParams(), {
    id: "any_id",
  });
