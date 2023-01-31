import { SurveyModel } from "@/domain/models/survey";

export type AddSurveyModel = Omit<SurveyModel, "id">;

export type AddSurvey = {
  add(account: AddSurveyModel): Promise<void>;
};
