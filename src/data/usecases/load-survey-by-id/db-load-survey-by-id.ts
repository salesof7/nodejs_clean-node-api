import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-repository copy";
import { SurveyModel } from "@/domain/models/survey";
import { LoadSurveyById } from "@/domain/usecases/load-survey-by-id";

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async loadById(id: string): Promise<SurveyModel> {
    await this.loadSurveyByIdRepository.loadById(id);
    return null;
  }
}