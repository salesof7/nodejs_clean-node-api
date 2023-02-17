import { LogErrorRepository } from "../protocols/db/log/log-error-repository";

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      await new Promise<void>((resolve) => {
        resolve();
      });
    }
  }

  return new LogErrorRepositoryStub();
};
