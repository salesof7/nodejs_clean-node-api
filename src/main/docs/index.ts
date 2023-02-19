import {
  badRequest,
  forbidden,
  notFound,
  serverError,
  unauthorized,
} from "./components";
import {
  accountSchema,
  apiKeyAuthSchema,
  errorSchema,
  loginParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
} from "./schemas";
import { loginPath, surveyPath } from "./paths";

export default {
  openapi: "3.0.0",
  info: {
    title: "Clean Node API",
    description:
      "API do curso do Mango para realizar enquetes entre programadores",
    version: "1.0.0",
  },
  servers: [
    {
      url: "/api",
    },
  ],
  tags: [
    {
      name: "Login",
    },
    {
      name: "Enquete",
    },
  ],
  paths: {
    "/login": loginPath,
    "/surveys": surveyPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema,
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema,
    },
    badRequest,
    serverError,
    unauthorized,
    notFound,
    forbidden,
  },
};
