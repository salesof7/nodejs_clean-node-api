import {
  badRequest,
  forbidden,
  notFound,
  serverError,
  unauthorized,
} from "./components";
import {
  accountSchema,
  addSurveyParamsSchema,
  apiKeyAuthSchema,
  errorSchema,
  loginParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
} from "./schemas";
import { loginPath, signUpPath, surveyPath } from "./paths";

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
    "/signup": signUpPath,
    "/surveys": surveyPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    signUpParams: loginParamsSchema,
    error: errorSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema,
    addSurveyParams: addSurveyParamsSchema,
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
