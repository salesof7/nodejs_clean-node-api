import { MongoHelper } from "../helpers/mongo-helper";
import { AddSurveyParams } from "@/domain/usecases/survey/add-survey";
import { SurveyModel } from "@/domain/models/survey";
import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";
import { LoadSurveysRepository } from "@/data/protocols/db/survey/load-survey-repository";
import { LoadSurveyByIdRepository } from "@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols";

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository
{
  async add(surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const surveys: SurveyModel[] = await surveyCollection.find().toArray();
    return MongoHelper.mapCollection(surveys);
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const survey: SurveyModel = await surveyCollection.findOne({ _id: id });
    return survey && MongoHelper.map(survey);
  }
}
