import env from "@/main/config/env";
import { JwtAdapter } from "@/infra/cryptograph/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "@/infra/db/mongodb/account/account-mongo-repository";
import { DbLoadAccountByToken } from "@/data/usecases/account/load-account-by-token/db-load-account-by-token";
import { LoadAccountByToken } from "@/domain/usecases/account/load-account-by-token";

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};
