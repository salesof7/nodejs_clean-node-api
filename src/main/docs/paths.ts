import { surveyResultPath, surveyPath, signUpPath, loginPath } from "./paths/";

export default {
  "/login": loginPath,
  "/signup": signUpPath,
  "/surveys": surveyPath,
  "/surveys/{surveyId}/results": surveyResultPath,
};
